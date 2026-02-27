import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LogUtil } from '../utils/log.util';
import { StatService } from 'src/api/stat/stat.service';

@Controller()
export class MqttController {
  constructor(private readonly statService: StatService) {}

  @MessagePattern('sensor/data')
  async handleSensorData(@Payload() message: any) {
    try {
      const jsonMsg = JSON.parse(message);

      if (!jsonMsg.talusId || !jsonMsg.stats || !jsonMsg.timestamp) {
        LogUtil.warn('Invalid message format:', jsonMsg);
        return;
      }

      await this.statService.createStats({
        talusId: jsonMsg.talusId,
        stats: jsonMsg.stats,
        timestamp: new Date(jsonMsg.timestamp)
      });
    } catch (error) {
      LogUtil.error('Error saving stats:', error);
    }
  }
}
