import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stat } from 'src/entities/stat.entity';
import { StatService } from './stat.service';
import { StatController } from './stat.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Stat])],
  controllers: [StatController],
  providers: [StatService],
  exports: [StatService]
})
export class StatModule {}
