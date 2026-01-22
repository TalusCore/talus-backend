import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class GetStatsByNameRangeDto {
  @ApiProperty({
    example: 'temperature',
    description: 'The name of the stat to fetch'
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
    example: '2025-07-06T14:00:00.000Z',
    description: 'The initial timestamp to fetch stats from (ISO 8601 format)'
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  startTime: Date;

  @ApiProperty({
    example: '2025-07-07T14:00:00.000Z',
    description: 'The ending timestamp to fetch stats until (ISO 8601 format)'
  })
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  endTime: Date;
}
