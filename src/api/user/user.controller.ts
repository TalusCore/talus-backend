import {
  Controller,
  Post,
  Body,
  UnauthorizedException,
  NotFoundException
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from 'src/entities/user.entity';
import * as bcrypt from 'bcrypt';
import { UserLoginDto } from './dto/user-login.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 201, description: 'User created', type: User })
  async signUp(@Body() data: CreateUserDto): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    return this.userService.createUser({ ...data, password: hashedPassword });
  }

  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @ApiBody({ type: UserLoginDto })
  @ApiResponse({ status: 200, description: 'Successful login', type: User })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async login(@Body() data: UserLoginDto): Promise<User> {
    const user = await this.userService.findByEmail(data.email);

    if (user) {
      const isMatch = await bcrypt.compare(data.password, user.password);

      if (isMatch) {
        return user;
      }
      throw new UnauthorizedException('Invalid credentials');
    }

    throw new NotFoundException('User not found');
  }
}
