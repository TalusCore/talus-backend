import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LogUtil } from '../utils/log.util';
import { StatService } from 'src/api/stat/stat.service';
import { TalusService } from 'src/api/talus/talus.service';

@Controller()
export class MqttController {
  constructor(
    private readonly statService: StatService,
    private readonly talusService: TalusService
  ) {}

  @MessagePattern('sensor/data')
  async handleSensorData(@Payload() message: any) {
    try {
      const jsonMsg = JSON.parse(message);
      LogUtil.info('Received MQTT message:', jsonMsg);

      if (!jsonMsg.talusId || !jsonMsg.stats || !jsonMsg.timestamp) {
        LogUtil.warn('Invalid message format:', jsonMsg);
        return;
      }

      const talus = await this.talusService.getTalusById(jsonMsg.talusId);

      if (!talus) {
        LogUtil.warn(`Talus with ID ${jsonMsg.talusId} not found.`);
        return;
      }

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
