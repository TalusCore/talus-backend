import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { MqttModule } from './mqtt/mqtt.module';
import Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './api/user/user.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().default(3000),
        MQTT_URL: Joi.string().required(),
        MQTT_PORT: Joi.number().required(),
        MQTT_USERNAME: Joi.string().required(),
        MQTT_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USER: Joi.string().required(),
        DB_PASS: Joi.string().required(),
        DB_NAME: Joi.string().required(),
        IS_DEVELOPMENT: Joi.boolean().default(false)
      })
    }),
    MqttModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT!, 10),
      username: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
      entities: [__dirname + '/entities/*.entity{.ts,.js}'],
      synchronize: process.env.IS_DEVELOPMENT === 'true',
      ssl: {
        rejectUnauthorized: false
      },
      logging:
        process.env.IS_DEVELOPMENT === 'true' ? ['query', 'error'] : false
    }),
    UserModule
  ],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
