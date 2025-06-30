import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
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
        IS_DEV: Joi.boolean().default(false)
      }),
      validationOptions: {
        abortEarly: false
      }
    }),
    MqttModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USER'),
        password: config.get<string>('DB_PASS'),
        database: config.get<string>('DB_NAME'),
        entities: [__dirname + '/entities/*.entity{.ts,.js}'],
        synchronize: config.get<boolean>('IS_DEV'),
        ssl: config.get<boolean>('IS_DEV')
          ? { rejectUnauthorized: false }
          : { rejectUnauthorized: true },
        logging: config.get<boolean>('IS_DEV') ? ['query', 'error'] : false
      })
    }),
    UserModule
  ],
  controllers: [],
  providers: []
})
export class AppModule {}
