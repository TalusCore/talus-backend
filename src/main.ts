import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { MqttClientOptions } from '@nestjs/microservices/external/mqtt-options.interface';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LogUtil } from './utils/log.util';

const options: MqttClientOptions = {
  host: process.env.MQTT_URL,
  port: parseInt(process.env.MQTT_PORT!),
  clientId: 'nestjs_mqtt_client',
  protocol: 'mqtts' as const,
  username: process.env.MQTT_USERNAME,
  password: process.env.MQTT_PASSWORD
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API docs for my NestJS app')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = process.env.PORT;
  await app.listen(parseInt(port!, 10));
  LogUtil.info(`HTTP server listening on ${port}`);

  const microservice = app.connectMicroservice({
    transport: Transport.MQTT,
    options: options
  });

  await microservice.listen();
  LogUtil.info('MQTT Microservice listening...');
}

bootstrap();
