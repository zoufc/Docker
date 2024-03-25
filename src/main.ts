import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { logger } from './utils/logger/logger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: '*',
    allowedHeaders: [
      'access-control-allow-origin',
      'x-access-token',
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    ],
    methods: 'POST,GET,PUT,PATCH,DELETE',
  });
  const port = app.get(ConfigService).get('port');
  const db = app.get(ConfigService).get('db');
  await app.listen(port);
  logger.info(`--DB URI--- ${db}`);
  logger.info(`DOCKER TEST IS RUNNING ON ${await app.getUrl()}`);
}
bootstrap();
