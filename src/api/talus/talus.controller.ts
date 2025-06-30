import {
  Controller,
  Post,
  Body,
  NotFoundException,
  ConflictException
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

    const talus = await this.talusService.createTalus(talusData);

    if (!talus) {
      LogUtil.error('Failed to create Talus device');
      throw new ConflictException('Failed to create Talus device');
    }

    const userTalusRelationData: CreateUserTalusRelationDto = {
      userId: existingUser.userId,
      talusId: talus.talusId
    };
    const userTalusRelation =
      await this.userTalusRelationService.createUserTalusRelation(
        userTalusRelationData
      );

    if (!userTalusRelation) {
      LogUtil.error('Failed to create user-talus relation');
      throw new ConflictException('Failed to create user-talus relation');
    }

    return {
      email: data.email,
      talusName: talus.name
    };
  }
}
