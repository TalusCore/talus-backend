import { Module } from '@nestjs/common';
import { MqttController } from './mqtt.controller';
import { StatModule } from 'src/api/stat/stat.module';
import { TalusModule } from 'src/api/talus/talus.module';

@Module({
  imports: [StatModule, TalusModule],
  controllers: [MqttController]
})
export class MqttModule {}
