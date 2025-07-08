import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TalusInfoDto {
  @ApiProperty({
    example: 'john@example.com',
    description: 'The email of the Talus device owner'
  })
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    example: 'Talus Device 1',
    description: 'The name of the Talus device'
  })
  @IsNotEmpty()
  @IsString()
  talusName: string;
}
