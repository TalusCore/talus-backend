import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  NotFoundException,
  ConflictException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfoDto } from './dto/user-info.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created', type: UserInfoDto })
  @ApiResponse({ status: 409, description: 'Email already in use' })
  async signUp(@Body() data: CreateUserDto): Promise<UserInfoDto> {
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
      name: newUser.name,
      email: newUser.email,
      createdAt: newUser.accountCreation
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
          name: user.name,
          email: user.email,
          createdAt: user.accountCreation
        };
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    throw new NotFoundException('User not found');
  }
}
