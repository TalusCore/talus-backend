import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterTalusDto {
  @ApiProperty({
    example: 'uuiodfj-1234-5678-90ab-cdef12345678',
    description: 'The id of the Talus device'
  })
  @IsNotEmpty()
  @IsString()
  talusId: string;

  @ApiProperty({
    example: 'Talus Device 1',
    description: 'The name of the Talus device'
  })
  @IsNotEmpty()
  @IsString()
  name: string;
}
