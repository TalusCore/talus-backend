import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserTalusRelation } from 'src/entities/user-talus-relation.entity';
import { Repository } from 'typeorm';
import { CreateUserTalusRelationDto } from './dto/create-user-talus-relation.dto';

@Injectable()
export class UserTalusRelationService {
  constructor(
    @InjectRepository(UserTalusRelation)
    private readonly UserTalusRelationRepository: Repository<UserTalusRelation>
  ) {}

  async createUserTalusRelation(
    relationData: CreateUserTalusRelationDto
  ): Promise<UserTalusRelation> {
    const relation = this.UserTalusRelationRepository.create(relationData);
    return this.UserTalusRelationRepository.save(relation);
  }
}
