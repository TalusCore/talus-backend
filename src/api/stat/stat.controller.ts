import { Controller, Body, Get, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { LogUtil } from 'src/utils/log.util';
import { StatService } from './stat.service';
import { TalusService } from '../talus/talus.service';
import { GetStatsDto } from './dto/get-stats.dto';
import { FetchedStatDto } from './dto/fetched-stat.dto';

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
  async fetchStats(@Body() data: GetStatsDto): Promise<FetchedStatDto[]> {
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
}
