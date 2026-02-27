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
      const jsonMsg =
        typeof message === 'string' ? JSON.parse(message) : message;

      if (!jsonMsg.talusId || !jsonMsg.stats || !jsonMsg.timestamp) {
        LogUtil.warn('Invalid message format:', jsonMsg);
        return;
      }

      const timestamp = new Date(jsonMsg.timestamp);
      if (isNaN(timestamp.getTime())) {
        LogUtil.warn('Invalid timestamp in message:', jsonMsg.timestamp);
        return;
      }

      await this.statService.createStats({
        talusId: jsonMsg.talusId,
        stats: jsonMsg.stats,
        timestamp
      });
    } catch (error) {
      if (error instanceof SyntaxError) {
        LogUtil.error('JSON parse error:', error.message);
      } else {
        LogUtil.error('Error saving stats:', error);
      }
    }
  }
}
