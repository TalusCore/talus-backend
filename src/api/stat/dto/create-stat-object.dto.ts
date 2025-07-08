import { IsDate, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStatObjectDto {
  @ApiProperty({
    example: 'uuiodfj-1234-5678-90ab-cdef12345678',
    description: 'The ID of the Talus device associated with this stat'
  })
  @IsNotEmpty()
  @IsString()
  talusId: string;

  @ApiProperty({
    example: {
      heartRate: 68.5,
      temperature: 36.6,
      steps: 1000
    },
    description:
      'An object containing stat names and their corresponding values',
    type: 'object',
    additionalProperties: { type: 'number' }
  })
  @IsNotEmpty()
  stats: Record<string, number>;

  @ApiProperty({
    example: '2023-10-01T12:00:00Z',
    description: 'The timestamp when the stats were recorded in ISO format'
  })
  @IsNotEmpty()
  @IsDate()
  timestamp: Date;
}
