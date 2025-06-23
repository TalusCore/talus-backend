import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { MqttClientOptions } from '@nestjs/microservices/external/mqtt-options.interface';

const options: MqttClientOptions = {
  host: process.env.MQTT_URL,
  port: parseInt(process.env.MQTT_PORT!),
  clientId: 'nestjs_mqtt_client',
  protocol: 'mqtts' as const,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD
};

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.MQTT,
      options: options
    }
  );

  await app.listen();
  console.log('MQTT Microservice listening...');
}

bootstrap();
