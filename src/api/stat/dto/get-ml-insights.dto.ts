import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetMLInsightsDto {
  @ApiProperty({
    description: 'age of the user in years',
    example: 30
  })
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @ApiProperty({
    description: 'weight of the user in kilograms',
    example: 70.5
  })
  @IsNotEmpty()
  @IsNumber()
  weight_kg: number;

  @ApiProperty({
    description: 'height of the user in centimeters',
    example: 175.0
  })
  @IsNotEmpty()
  @IsNumber()
  height_cm: number;

  @ApiProperty({
    description: 'gender of the user',
    example: 'M'
  })
  @IsNotEmpty()
  @IsString()
  gender: string;

  @ApiProperty({
    description: 'number of steps taken by the user so far today',
    example: 8000
  })
  @IsNotEmpty()
  @IsNumber()
  steps_per_day: number;

  @ApiProperty({
    description:
      'number of workout sessions the user has done in the last week',
    example: 3
  })
  @IsNotEmpty()
  @IsNumber()
  workout_frequency_per_week: number;

  @ApiProperty({
    description: 'average heart rate of the user in beats per minute',
    example: 70
  })
  @IsNotEmpty()
  @IsNumber()
  avg_heart_rate: number;

  @ApiProperty({
    description: 'The number of minutes the user has spent exercising today',
    example: 45
  })
  @IsNotEmpty()
  @IsNumber()
  exercise_minutes_per_day: number;

  @ApiProperty({
    description:
      'fitness level of the user on a scale from 0 to 100, with 100 being the most fit',
    example: 85
  })
  @IsNotEmpty()
  @IsNumber()
  fitness_level: number;
}
