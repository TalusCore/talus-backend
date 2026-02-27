import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpService } from '@nestjs/axios';
import { Stat } from 'src/entities/stat.entity';
import { Repository, MoreThanOrEqual, Between } from 'typeorm';
import { firstValueFrom } from 'rxjs';
import { CreateStatDto } from './dto/create-stat.dto';
import { CreateStatObjectDto } from './dto/create-stat-object.dto';
import { GetMLParamsDto } from './dto/get-ml-params.dto';
import { GetMLInsightsDto } from './dto/get-ml-insights.dto';

@Injectable()
export class StatService {
  constructor(
    @InjectRepository(Stat)
    private readonly statRepository: Repository<Stat>,
    private readonly httpService: HttpService
  ) {}

  async getStatsByTalus(
    talusId: string,
    startDateTime: Date,
    limit: number = 1000
  ): Promise<Stat[]> {
    return this.statRepository.find({
      where: {
        talusId,
        timestamp: MoreThanOrEqual(startDateTime)
      },
      order: { timestamp: 'DESC' },
      take: limit
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
    endDateTime: Date,
    limit: number = 1000
  ): Promise<Stat[]> {
    return this.statRepository.find({
      where: {
        statName,
        talusId,
        timestamp: Between(startDateTime, endDateTime)
      },
      order: { timestamp: 'DESC' },
      take: limit
    });
  }

  async getStatByNameAndTalusAllTime(
    statName: string,
    talusId: string,
    limit: number = 10000
  ): Promise<Stat[]> {
    return this.statRepository.find({
      where: {
        statName,
        talusId
      },
      order: { timestamp: 'DESC' },
      take: limit
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

    const newStats = this.statRepository.create(statsArray);
    return this.statRepository.save(newStats);
  }

  async getExerciseMinutesPerDay(
    talusId: string,
    avgHeartRate: number,
    selectedDate: Date
  ): Promise<number> {
    const startofDay = new Date(selectedDate);
    startofDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(selectedDate);
    endOfDay.setHours(23, 59, 59, 999);

    const heartRateData = await this.getStatsByNameAndTalus(
      'bpm',
      talusId,
      startofDay,
      endOfDay
    );

    const exerciseMinutesData = heartRateData.filter(
      (stat) => stat.value > avgHeartRate
    );

    const uniqueMinutes = new Set(
      exerciseMinutesData.map((stat) => {
        const date = new Date(stat.timestamp);
        return `${date.getHours()}:${date.getMinutes()}`;
      })
    );

    return uniqueMinutes.size;
  }

  async getWorkoutFrequencyPerWeek(
    talusId: string,
    avgHeartRate: number
  ): Promise<number> {
    let workoutFreq = 0;

    for (let i = 0; i < 7; i++) {
      const today = new Date();
      const selectedDate = new Date();
      selectedDate.setDate(today.getDate() - i);

      const exerciseMinutes = await this.getExerciseMinutesPerDay(
        talusId,
        avgHeartRate,
        selectedDate
      );

      workoutFreq += Math.floor(exerciseMinutes / 30);
    }

    return workoutFreq;
  }

  async getMLParams(mlParams: GetMLParamsDto): Promise<GetMLInsightsDto> {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    oneWeekAgo.setHours(0, 0, 0, 0);

    const heartRateData = await this.getStatByNameAndTalusAllTime(
      'bpm',
      mlParams.talusId
    );

    const avgHeartRate =
      heartRateData.reduce((sum, stat) => sum + stat.value, 0) /
      heartRateData.length;

    const exerciseMinutesPerDay = await this.getExerciseMinutesPerDay(
      mlParams.talusId,
      avgHeartRate,
      new Date()
    );

    const workoutFrequencyPerWeek = await this.getWorkoutFrequencyPerWeek(
      mlParams.talusId,
      avgHeartRate
    );

    return {
      age: mlParams.age,
      gender: mlParams.gender,
      weight_kg: mlParams.weight_kg,
      height_cm: mlParams.height_cm,
      steps_per_day: mlParams.steps_per_day,
      workout_frequency_per_week: workoutFrequencyPerWeek,
      avg_heart_rate: avgHeartRate,
      exercise_minutes_per_day: exerciseMinutesPerDay,
      fitness_level: mlParams.fitness_level
    };
  }

  async getMLInsights(
    age: number,
    gender: string,
    weight_kg: number,
    height_cm: number,
    steps_per_day: number,
    workout_frequency_per_week: number,
    avg_heart_rate: number,
    exercise_minutes_per_day: number,
    fitness_level: number
  ): Promise<string> {
    const response = await firstValueFrom(
      this.httpService.post(
        'https://talus-machine-learning.onrender.com/analyze',
        {
          age,
          gender,
          weight_kg,
          height_cm,
          steps_per_day,
          workout_frequency_per_week,
          avg_heart_rate,
          exercise_minutes_per_day,
          fitness_level
        }
      )
    );
    return response.data;
  }
}
