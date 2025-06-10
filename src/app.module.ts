import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MqttModule } from './mqtt/mqtt.module';
import Joi from 'joi';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MQTT_URL: Joi.string().uri().required(),
        MQTT_PORT: Joi.number().required(),
        MQTT_USERNAME: Joi.string().required(),
        MQTT_PASSWORD: Joi.string().required()
      })
    }),
    MqttModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
