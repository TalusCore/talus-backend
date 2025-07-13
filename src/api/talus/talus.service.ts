import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Talus } from 'src/entities/talus.entity';
import { Repository } from 'typeorm';
import { RegisterTalusDto } from './dto/register-talus.dto';

@Injectable()
export class TalusService {
  constructor(
    @InjectRepository(Talus)
    private readonly talusRepository: Repository<Talus>
  ) {}

  async getTalusById(talusId: string): Promise<Talus | null> {
    return this.talusRepository.findOne({
      where: { talusId }
    });
  }

  async createTalus(talusData: RegisterTalusDto): Promise<Talus> {
    const talus = this.talusRepository.create(talusData);
    return this.talusRepository.save(talus);
  }

  async deleteTalus(talusId: string): Promise<void> {
    const result = await this.talusRepository.delete({ talusId });

    if (result.affected === 0) {
      throw new NotFoundException(`Talus device with ID ${talusId} not found`);
    }
  }

  async renameTalus(talusId: string, newName: string): Promise<Talus> {
    const talus = await this.getTalusById(talusId);

    if (!talus) {
      throw new NotFoundException(`Talus device with ID ${talusId} not found`);
    }

    talus.name = newName;
    return this.talusRepository.save(talus);
  }
}
