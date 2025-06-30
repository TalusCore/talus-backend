import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'StrongPassword123!',
    description: "The password for the user's account"
  })
  @IsNotEmpty()
  @IsString()
  password: string;
}
