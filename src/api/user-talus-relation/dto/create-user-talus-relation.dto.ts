import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserTalusRelationDto {
  @ApiProperty({
    example: '4232-1234-5678-90ab-cdef12345678',
    description: 'The user ID of the Talus device owner'
  })
  @IsNotEmpty()
  @IsString()
  userId: string;

  @ApiProperty({
    example: 'uuiodfj-1234-5678-90ab-cdef12345678',
    description: 'The id of the Talus device'
  })
  @IsNotEmpty()
  @IsString()
  talusId: string;
}
