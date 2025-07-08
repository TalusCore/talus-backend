import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { LogUtil } from '../utils/log.util';

@Controller()
export class MqttController {
  @MessagePattern('sensor/data')
  handleSensorData(@Payload() message: any) {
    LogUtil.info('Received MQTT message:', message);
  }
}
