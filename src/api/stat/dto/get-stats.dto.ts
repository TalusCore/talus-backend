import {
  IsDate,
  IsNotEmpty,
  IsString,
  IsOptional,
  IsInt,
  Min,
  Max
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetStatsDto {
  @ApiProperty({
    example: 'uuiodfj-1234-5678-90ab-cdef12345678',
    description: 'The ID of the Talus device associated with this stat'
  })
  @IsNotEmpty()
  @IsString()
  talusId: string;

  @ApiProperty({
    example: '2025-07-06T14:00:00.000Z',
    description: 'The initial timestamp to fetch stats from (ISO 8601 format)'
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @ApiProperty({
    example: 1000,
    description:
      'Maximum number of stats to return (default: 1000, max: 10000)',
    required: false
  })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(10000)
  limit?: number = 1000;
}
