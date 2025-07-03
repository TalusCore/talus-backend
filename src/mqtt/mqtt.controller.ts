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
      LogUtil.info('Received MQTT message:', jsonMsg);

      const stats = await this.statService.createStats({
        talusId: jsonMsg.talusId,
        stats: jsonMsg.stats,
        timestamp: new Date(jsonMsg.timestamp)
      });

      LogUtil.info('Stats saved successfully:', stats);
    } catch (error) {
      LogUtil.error('Error saving stats:', error);
    }
  }
}
