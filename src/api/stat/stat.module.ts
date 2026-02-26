import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { Stat } from 'src/entities/stat.entity';
import { StatService } from './stat.service';
import { StatController } from './stat.controller';
import { TalusModule } from '../talus/talus.module';

@Module({
  imports: [TypeOrmModule.forFeature([Stat]), TalusModule, HttpModule],
  controllers: [StatController],
  providers: [StatService],
  exports: [StatService]
})
export class StatModule {}
