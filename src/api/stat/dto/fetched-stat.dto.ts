import { IsDate, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FetchedStatDto {
  @ApiProperty({
    description: 'Name of the stat',
    example: 'temperature'
  })
  @IsNotEmpty()
  @IsString()
  statName: string;

  @ApiProperty({
    description: 'Value of the stat',
    example: 23.5
  })
  @IsNotEmpty()
  @IsNumber()
  value: number;

  @ApiProperty({
    description: 'Timestamp of the stat in ISO format',
    example: '2024-07-07T12:34:56.789Z'
  })
  @IsNotEmpty()
  @IsDate()
  timestamp: Date;
}
