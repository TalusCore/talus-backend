import { Controller, Get, NotFoundException, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LogUtil } from 'src/utils/log.util';
import { StatService } from './stat.service';
import { TalusService } from '../talus/talus.service';
import { GetStatsDto } from './dto/get-stats.dto';
import { FetchedStatDto } from './dto/fetched-stat.dto';
import { GetStatsByNameRangeDto } from './dto/get-stats-by-name-range.dto';

@ApiTags('stat')
@Controller('stat')
export class StatController {
  constructor(
    private readonly talusService: TalusService,
    private readonly statService: StatService
  ) {}

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
    const existingTalus = await this.talusService.getTalusById(data.talusId);

    if (!existingTalus) {
      LogUtil.error(
        `Talus with ID ${data.talusId} not found. Cannot fetch stats.`
      );
      throw new NotFoundException(
        `Talus with ID ${data.talusId} not found. Cannot fetch stats.`
      );
    }

    const stats = await this.statService.getStatsByTalus(
      data.talusId,
      data.startTime
    );

    LogUtil.info(
      `Fetched ${stats.length} stats for Talus with ID ${data.talusId} since ${data.startTime}.`
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
    const existingTalus = await this.talusService.getTalusById(talusId);

    if (!existingTalus) {
      LogUtil.error(
        `Talus with ID ${talusId} not found. Cannot fetch stat names.`
      );
      throw new NotFoundException(
        `Talus with ID ${talusId} not found. Cannot fetch stat names.`
      );
    }

    const statNames = await this.statService.getStatNamesByTalus(talusId);

    LogUtil.info(
      `Fetched ${statNames.length} stat names for Talus with ID ${talusId}.`
    );
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
    const existingTalus = await this.talusService.getTalusById(data.talusId);

    if (!existingTalus) {
      LogUtil.error(
        `Talus with ID ${data.talusId} not found. Cannot fetch stats by name.`
      );
      throw new NotFoundException(
        `Talus with ID ${data.talusId} not found. Cannot fetch stats by name.`
      );
    }

    const stats = await this.statService.getStatsByNameAndTalus(
      data.talusId,
      data.statName,
      data.startTime,
      data.endTime
    );

    LogUtil.info(
      `Fetched ${stats.length} stats for Talus with ID ${data.talusId} and stat name ${data.statName} between ${data.startTime} and ${data.endTime}.`
    );
    return stats.map((stat) => ({
      statName: stat.statName,
      value: stat.value,
      timestamp: stat.timestamp
    }));
  }
}
