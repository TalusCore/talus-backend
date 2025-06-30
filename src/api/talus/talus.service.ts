import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Talus } from 'src/entities/talus.entity';
import { Repository } from 'typeorm';
import { RegisterTalusDto } from './dto/register-talus.dto';

@Injectable()
export class TalusService {
  constructor(
    @InjectRepository(Talus)
    private readonly TalusRepository: Repository<Talus>
  ) {}

  async getTalusById(talusId: string): Promise<Talus | null> {
    return this.TalusRepository.findOne({
      where: { talusId }
    });
  }

  async createTalus(talusData: RegisterTalusDto): Promise<Talus> {
    const talus = this.TalusRepository.create(talusData);
    return this.TalusRepository.save(talus);
  }
}
