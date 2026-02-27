import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { StatService } from './stat.service';
import { GetStatsDto } from './dto/get-stats.dto';
import { FetchedStatDto } from './dto/fetched-stat.dto';
import { GetStatsByNameRangeDto } from './dto/get-stats-by-name-range.dto';
import { GetMLParamsDto } from './dto/get-ml-params.dto';

@ApiTags('stat')
@Controller('stat')
export class StatController {
  constructor(private readonly statService: StatService) {}

  @Get()
  @ApiOperation({
    summary: 'Get the stats for a Talus since a given date'
  })
  @ApiBody({ type: GetStatsDto })
  @ApiResponse({
    status: 200,
    description: 'Stats fetched successfully',
    type: [FetchedStatDto]
  })
  @ApiResponse({
    status: 404,
    description: 'Talus not found'
  })
  async fetchStats(@Query() data: GetStatsDto): Promise<FetchedStatDto[]> {
    const stats = await this.statService.getStatsByTalus(
      data.talusId,
      data.startTime,
      data.limit || 1000
    );

    return stats.map((stat) => ({
      statName: stat.statName,
      value: stat.value,
      timestamp: stat.timestamp
    }));
  }

  @Get('names')
  @ApiOperation({
    summary: 'Get the distinct stat names for a Talus'
  })
  @ApiResponse({
    status: 200,
    description: 'Stat names fetched successfully',
    type: [String]
  })
  @ApiResponse({
    status: 404,
    description: 'Talus not found'
  })
  async fetchStatNames(@Query('talusId') talusId: string): Promise<string[]> {
    const statNames = await this.statService.getStatNamesByTalus(talusId);

    return statNames;
  }

  @Get('stat-by-name')
  @ApiOperation({
    summary:
      'Get the stats for a Talus by stat name within a specified date range'
  })
  @ApiBody({ type: GetStatsByNameRangeDto })
  @ApiResponse({
    status: 200,
    description: 'Stats fetched successfully',
    type: [FetchedStatDto]
  })
  @ApiResponse({
    status: 404,
    description: 'Talus not found'
  })
  async fetchStatsByName(
    @Query() data: GetStatsByNameRangeDto
  ): Promise<FetchedStatDto[]> {
    const stats = await this.statService.getStatsByNameAndTalus(
      data.statName,
      data.talusId,
      data.startTime,
      data.endTime,
      data.limit || 1000
    );

    return stats.map((stat) => ({
      statName: stat.statName,
      value: stat.value,
      timestamp: stat.timestamp
    }));
  }

  @Get('ml_insights')
  @ApiOperation({
    summary: 'Get ML insights for a Talus'
  })
  @ApiResponse({
    status: 200,
    description: 'ML insights fetched successfully',
    type: String
  })
  @ApiResponse({
    status: 404,
    description: 'Talus not found'
  })
  async fetchMLInsights(@Query() data: GetMLParamsDto): Promise<string> {
    const existingTalus = await this.talusService.getTalusById(data.talusId);

    if (!existingTalus) {
      LogUtil.error(
        `Talus with ID ${data.talusId} not found. Cannot fetch ML insights.`
      );
      throw new NotFoundException(
        `Talus with ID ${data.talusId} not found. Cannot fetch ML insights.`
      );
    }

    const mlParams = await this.statService.getMLParams(data);

    const mlInsights = await this.statService.getMLInsights(
      mlParams.age,
      mlParams.gender,
      mlParams.weight_kg,
      mlParams.height_cm,
      mlParams.steps_per_day,
      mlParams.workout_frequency_per_week,
      mlParams.avg_heart_rate,
      mlParams.exercise_minutes_per_day,
      mlParams.fitness_level
    );

    LogUtil.info(`Fetched ML insights for Talus with ID ${data.talusId}.`);
    return mlInsights;
  }
}
