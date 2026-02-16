import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  NotFoundException,
  ConflictException,
  Get,
  Res,
  Query,
  Put
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfoDto } from './dto/user-info.dto';
import { LogUtil } from 'src/utils/log.util';
import { RegisterTalusDto } from '../talus/dto/register-talus.dto';
import { Response } from 'express';
import { UserTalusRelationService } from '../user-talus-relation/user-talus-relation.service';
import { EditUserDto } from './dto/edit-user.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userTalusRelationService: UserTalusRelationService
  ) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created', type: UserInfoDto })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async signUp(@Body() data: CreateUserDto): Promise<UserInfoDto> {
    LogUtil.info(`User registration attempt for email: ${data.email}`);
    const existingUser = await this.userService.findByEmail(data.email);

    if (existingUser) {
      throw new ConflictException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const newUser = await this.userService.createUser({
      ...data,
      password: hashedPassword
    });

    return {
      firstName: newUser.firstName,
      lastName: newUser.lastName,
      email: newUser.email,
      birthday: newUser.birthday,
      height: newUser.height,
      weight: newUser.weight,
      gender: newUser.gender,
      createdAt: newUser.createdAt
    };
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: UserLoginDto })
  @ApiResponse({
    status: 200,
    description: 'Successful login',
    type: UserInfoDto
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async login(@Body() data: UserLoginDto): Promise<UserInfoDto> {
    const user = await this.userService.findByEmail(data.email);

    if (user) {
      const isMatch = await bcrypt.compare(data.password, user.password);

      if (isMatch) {
        return {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          gender: user.gender,
          birthday: user.birthday,
          height: user.height,
          weight: user.weight,
          createdAt: user.createdAt
        };
      }
      LogUtil.error(
        `Login attempt with invalid password for user: ${data.email}`
      );
      throw new UnauthorizedException('Invalid credentials');
    }

    LogUtil.error(`Login attempt for non-existent user: ${data.email}`);
    throw new NotFoundException('User not found');
  }

  @Put('edit')
  @ApiOperation({ summary: 'Edit user information' })
  @ApiBody({ type: EditUserDto })
  @ApiResponse({
    status: 200,
    description: 'User information updated successfully',
    type: UserInfoDto
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async editUser(@Body() data: EditUserDto): Promise<UserInfoDto> {
    const user = await this.userService.findByEmail(data.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const updatedUser = await this.userService.editUser(user.userId, data);

    if (!updatedUser) {
      throw new NotFoundException(
        'Error updating user information, update may have failed'
      );
    }

    return {
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
      birthday: updatedUser.birthday,
      height: updatedUser.height,
      weight: updatedUser.weight,
      gender: updatedUser.gender,
      createdAt: updatedUser.createdAt
    };
  }

  @Get('most-recent-talus')
  @ApiOperation({
    summary: 'Get the most recent Talus for a user'
  })
  @ApiResponse({
    status: 200,
    description: 'Most recent Talus fetched successfully',
    type: RegisterTalusDto
  })
  @ApiResponse({
    status: 204,
    description: 'No Talus found for the user'
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getMostRecentTalus(
    @Query('email') email: string,
    @Res() res: Response
  ) {
    LogUtil.info(`Fetching most recent Talus for user: ${email}`);

    const user = await this.userService.findByEmail(email);

    if (!user) {
      LogUtil.error(`User with email ${email} not found`);
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const userTalusRelation =
      await this.userTalusRelationService.findMostRecentRelationByUserId(
        user.userId
      );

    if (!userTalusRelation) {
      LogUtil.warn(`No Talus found for user: ${email}`);
      return res.status(204).send();
    }

    const talus = userTalusRelation.talus;

    return res.status(200).json({
      talusId: talus.talusId,
      name: talus.name
    });
  }

  @Get('all-taluses')
  @ApiOperation({
    summary: 'Get all Taluses for a user'
  })
  @ApiResponse({
    status: 200,
    description: 'All Taluses fetched successfully',
    type: [RegisterTalusDto]
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getAllTaluses(
    @Query('email') email: string
  ): Promise<RegisterTalusDto[]> {
    LogUtil.info(`Fetching all Taluses for user: ${email}`);

    const user = await this.userService.findByEmail(email);

    if (!user) {
      LogUtil.error(`User with email ${email} not found`);
      throw new NotFoundException(`User with email ${email} not found`);
    }

    const relations =
      await this.userTalusRelationService.getAllRelationsByUserId(user.userId);

    if (relations.length === 0) {
      LogUtil.warn(`No Taluses found for user: ${email}`);
      return [];
    }

    return relations.map((relation) => ({
      talusId: relation.talus.talusId,
      name: relation.talus.name
    }));
  }
}
