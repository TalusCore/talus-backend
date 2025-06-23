import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class MqttController {
  @MessagePattern('sensor/data')
  handleSensorData(@Payload() message: any) {
    console.log('Received MQTT message:', message);
  }
}
