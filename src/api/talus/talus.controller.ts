import {
  Controller,
  Post,
  Body,
  NotFoundException,
  ConflictException,
  Get,
  Query,
  Delete,
  Put
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LogUtil } from 'src/utils/log.util';
import { TalusService } from './talus.service';
import { PairTalusDto } from './dto/pair-talus.dto';
import { TalusInfoDto } from './dto/talus-info.dto';
import { RegisterTalusDto } from './dto/register-talus.dto';
import { CreateUserTalusRelationDto } from '../user-talus-relation/dto/create-user-talus-relation.dto';
import { UserService } from '../user/user.service';
import { UserTalusRelationService } from '../user-talus-relation/user-talus-relation.service';

@ApiTags('talus')
@Controller('talus')
export class TalusController {
  constructor(
    private readonly talusService: TalusService,
    private readonly userService: UserService,
    private readonly userTalusRelationService: UserTalusRelationService
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get Talus device by ID' })
  @ApiResponse({
    status: 200,
    description: 'Talus device found',
    type: RegisterTalusDto
  })
  @ApiResponse({ status: 404, description: 'Talus device not found' })
  async getTalusById(
    @Query('talusId') talusId: string
  ): Promise<RegisterTalusDto> {
    const talus = await this.talusService.getTalusById(talusId);

    if (!talus) {
      LogUtil.error(`Talus device not found: ${talusId}`);
      throw new NotFoundException('Talus device not found');
    }

    return talus;
  }

  @Post()
  @ApiOperation({ summary: 'Pair a Talus device with a user' })
  @ApiBody({ type: PairTalusDto })
  @ApiResponse({
    status: 201,
    description: 'Talus device paired successfully',
    type: TalusInfoDto
  })
  @ApiResponse({ status: 400, description: 'Invalid pairing data' })
  @ApiResponse({ status: 409, description: 'Talus device already paired' })
  async pairTalus(@Body() data: PairTalusDto): Promise<TalusInfoDto> {
    const existingTalus = await this.talusService.getTalusById(data.talusId);

    if (existingTalus) {
      LogUtil.error(`Talus device already paired: ${data.talusId}`);
      throw new ConflictException('Talus device already paired');
    }

    const existingUser = await this.userService.findByEmail(data.email);

    if (!existingUser) {
      LogUtil.error(`User not found for email: ${data.email}`);
      throw new NotFoundException('User not found');
    }

    const talusData: RegisterTalusDto = {
      talusId: data.talusId,
      name: data.name
    };

    let talus;

    try {
      talus = await this.talusService.createTalus(talusData);
    } catch (error) {
      LogUtil.error(`Failed to create Talus device: ${error.message}`);
      throw new ConflictException('Failed to create Talus device');
    }

    const userTalusRelationData: CreateUserTalusRelationDto = {
      userId: existingUser.userId,
      talusId: talus.talusId
    };

    try {
      await this.userTalusRelationService.createUserTalusRelation(
        userTalusRelationData
      );
    } catch (error) {
      LogUtil.error(`Failed to create user-talus relation: ${error.message}`);
      throw new ConflictException('Failed to create user-talus relation');
    }

    return {
      email: data.email,
      talusName: talus.name
    };
  }

  @Delete()
  @ApiOperation({ summary: 'Delete a Talus device by ID' })
  @ApiResponse({
    status: 204,
    description: 'Talus device deleted successfully'
  })
  @ApiResponse({ status: 404, description: 'Talus device not found' })
  async deleteTalus(@Query('talusId') talusId: string): Promise<void> {
    const talus = await this.talusService.getTalusById(talusId);

    if (!talus) {
      LogUtil.error(`Talus device not found: ${talusId}`);
      throw new NotFoundException('Talus device not found');
    }

    await this.talusService.deleteTalus(talusId);
    LogUtil.info(`Talus device deleted successfully: ${talusId}`);
  }

  @Put()
  @ApiOperation({ summary: 'Rename a Talus device' })
  @ApiBody({ type: RegisterTalusDto })
  @ApiResponse({
    status: 200,
    description: 'Talus device renamed successfully',
    type: RegisterTalusDto
  })
  @ApiResponse({ status: 404, description: 'Talus device not found' })
  async renameTalus(@Body() data: RegisterTalusDto): Promise<RegisterTalusDto> {
    const talus = await this.talusService.getTalusById(data.talusId);

    if (!talus) {
      LogUtil.error(`Talus device not found: ${data.talusId}`);
      throw new NotFoundException('Talus device not found');
    }

    const updatedTalus = await this.talusService.renameTalus(
      data.talusId,
      data.name
    );

    LogUtil.info(`Talus device renamed successfully: ${data.talusId}`);
    return updatedTalus;
  }
}
