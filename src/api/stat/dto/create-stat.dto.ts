import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStatDto {
  @ApiProperty({
    example: 'heartRate',
    description:
      'The name of the stat being recorded, e.g., heartRate, temperature, etc.'
  })
  @IsNotEmpty()
  @IsString()
  statName: string;

  @ApiProperty({
    example: 'uuiodfj-1234-5678-90ab-cdef12345678',
    description: 'The ID of the Talus device associated with this stat'
  })
  @IsNotEmpty()
  @IsString()
  talusId: string;

  @ApiProperty({
    example: '68.5',
    description:
      'The value of the stat being recorded, e.g., heart rate in beats per minute, temperature in degrees Celsius, etc.'
  })
  @IsNotEmpty()
  @IsNumber()
  value: number;
}
