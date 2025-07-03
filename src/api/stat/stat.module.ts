import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Stat } from 'src/entities/stat.entity';
import { StatService } from './stat.service';

@Module({
  imports: [TypeOrmModule.forFeature([Stat])],
  providers: [StatService],
  exports: [StatService]
})
export class StatModule {}
