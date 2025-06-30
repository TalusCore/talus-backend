import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Talus } from 'src/entities/talus.entity';
import { TalusController } from './talus.controller';
import { TalusService } from './talus.service';
import { UserModule } from '../user/user.module';
import { UserTalusRelationModule } from '../user-talus-relation/user-talus-relation.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Talus]),
    UserModule,
    UserTalusRelationModule
  ],
  controllers: [TalusController],
  providers: [TalusService],
  exports: [TalusService]
})
export class TalusModule {}
