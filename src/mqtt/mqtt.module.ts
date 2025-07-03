import { Module } from '@nestjs/common';
import { MqttController } from './mqtt.controller';
import { StatModule } from 'src/api/stat/stat.module';

@Module({
  imports: [StatModule],
  controllers: [MqttController]
})
export class MqttModule {}
