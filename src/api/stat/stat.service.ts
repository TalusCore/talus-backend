import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Stat } from 'src/entities/stat.entity';
import { Repository, MoreThanOrEqual, Between } from 'typeorm';
import { CreateStatDto } from './dto/create-stat.dto';
import { CreateStatObjectDto } from './dto/create-stat-object.dto';

@Injectable()
export class StatService {
  constructor(
    @InjectRepository(Stat)
    private readonly statRepository: Repository<Stat>
  ) {}

  async getStatsByTalus(talusId: string, startDateTime: Date): Promise<Stat[]> {
    return this.statRepository.find({
      where: {
        talusId,
        timestamp: MoreThanOrEqual(startDateTime)
      },
      order: { timestamp: 'DESC' }
    });
  }

  async getStatNamesByTalus(talusId: string): Promise<string[]> {
    const statNames = await this.statRepository
      .createQueryBuilder('stat')
      .select('DISTINCT stat.statName', 'statName')
      .where('stat.talusId = :talusId', { talusId })
      .getRawMany();
    return statNames.map((record) => record.statName);
  }

  async getStatsByNameAndTalus(
    statName: string,
    talusId: string,
    startDateTime: Date,
    endDateTime: Date
  ): Promise<Stat[]> {
    return this.statRepository.find({
      where: {
        statName,
        talusId,
        timestamp: Between(startDateTime, endDateTime)
      },
      order: { timestamp: 'DESC' }
    });
  }

  async createStats(statData: CreateStatObjectDto): Promise<Stat[]> {
    const statsArray: CreateStatDto[] = Object.entries(statData.stats).map(
      ([statName, value]) => ({
        talusId: statData.talusId,
        statName,
        value,
        timestamp: statData.timestamp
      })
    );

    const newStats = statsArray.map((stat) => {
      const newStat = this.statRepository.create(stat);
      return this.statRepository.save(newStat);
    });

    return Promise.all(newStats);
  }
}
