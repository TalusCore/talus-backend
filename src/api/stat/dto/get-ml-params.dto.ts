import { IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class GetMLParamsDto {
  @ApiProperty({
    description: 'ID of the Talus to fetch ML parameters for',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsNotEmpty()
  @IsString()
  talusId: string;

  @ApiProperty({
    description: 'age of the user in years',
    example: 30
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  age: number;

  @ApiProperty({
    description: 'weight of the user in kilograms',
    example: 70.5
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  weight_kg: number;

  @ApiProperty({
    description: 'height of the user in centimeters',
    example: 175.0
  })
  @Type(() => Number)
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
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  steps_per_day: number;

  @ApiProperty({
    description:
      'fitness level of the user on a scale from 0 to 100, with 100 being the most fit',
    example: 85
  })
  @Type(() => Number)
  @IsNotEmpty()
  @IsNumber()
  fitness_level: number;
}
