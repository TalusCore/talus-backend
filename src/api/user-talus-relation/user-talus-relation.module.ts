import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserTalusRelation } from 'src/entities/user-talus-relation.entity';
import { UserTalusRelationService } from './user-talus-relation.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserTalusRelation])],
  providers: [UserTalusRelationService],
  exports: [UserTalusRelationService]
})
export class UserTalusRelationModule {}
