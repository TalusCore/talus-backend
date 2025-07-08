import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class UserInfoDto {
  @ApiProperty({
    example: 'John',
    description: 'The first name of the user'
  })
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty({
    example: 'Doe',
    description: 'The last name of the user'
  })
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty({
    example: 'john.doe@example.com',
    description: 'The email address of the user'
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '2023-01-01T12:00:00Z',
    description: 'The date and time when the user account was created'
  })
  @IsNotEmpty()
  @IsDate()
  createdAt: Date;
}
