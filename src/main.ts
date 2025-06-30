import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import { MqttClientOptions } from '@nestjs/microservices/external/mqtt-options.interface';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { LogUtil } from './utils/log.util';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  const configService = app.get(ConfigService);

  LogUtil.setIsDevelopment(configService.get<boolean>('IS_DEVELOPMENT')!);

  const config = new DocumentBuilder()
    .setTitle('My API')
    .setDescription('API docs for my NestJS app')
    .setVersion('1.0')
    .addTag('users')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get<number>('PORT') || 3000;

  const options: MqttClientOptions = {
    host: configService.get<string>('MQTT_URL')!,
    port: configService.get<number>('MQTT_PORT')!,
    clientId: 'nestjs_mqtt_client',
    protocol: 'mqtts' as const,
    username: configService.get<string>('MQTT_USERNAME')!,
    password: configService.get<string>('MQTT_PASSWORD')!
  };

  app.connectMicroservice({
    transport: Transport.MQTT,
    options: options
  });

  await app.startAllMicroservices();
  await app.listen(port);
  LogUtil.info(`HTTP server listening on port ${port}`);
  LogUtil.info('MQTT Microservice listening...');
}

bootstrap();
