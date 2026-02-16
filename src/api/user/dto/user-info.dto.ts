import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsDate,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsString
} from 'class-validator';

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
    example: '2000-01-01',
    description: 'The birthday of the user (YYYY-MM-DD)'
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  birthday: Date;

  @ApiProperty({
    example: 175.5,
    description: 'The height of the user in centimeters'
  })
  @IsNotEmpty()
  @IsNumber()
  height: number;

  @ApiProperty({
    example: 80.2,
    description: 'The weight of the user in kilograms'
  })
  @IsNotEmpty()
  @IsNumber()
  weight: number;

  @ApiProperty({
    example: 'Other',
    description: 'The gender of the user'
  })
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty({
    example: '2023-01-01T12:00:00Z',
    description: 'The date and time when the user account was created'
  })
  @IsNotEmpty()
  @IsDate()
  createdAt: Date;
}
