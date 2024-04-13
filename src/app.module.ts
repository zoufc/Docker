import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './api/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { AuthModule } from './api/auth/auth.module';
import { AuthMiddleware } from './middlewares/auth/auth.middleware';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './api/auth/roles/roles.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [
        () => ({
          port:
            process.env.NODE_ENV === 'production'
              ? process.env.PORT_PROD
              : process.env.PORT_DEV,
          db:
            process.env.NODE_ENV === 'production'
              ? process.env.DB_PROD
              : process.env.DB_DEV,
          privateKey:
            process.env.NODE_ENV === 'production'
              ? process.env.PRIVATE_KEY_PROD
              : process.env.PRIVATE_KEY_DEV,
          publicKey:
            process.env.NODE_ENV === 'production'
              ? process.env.PUBLIC_KEY_PROD
              : process.env.PUBLIC_KEY_DEV,
        }),
      ],
    }),
    MongooseModule.forRootAsync({
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('db'),
      }),
      inject: [ConfigService],
    }),
    JwtModule.register({
      secret: process.env.PRIVATE_KEY_DEV,
      signOptions: {
        expiresIn: '60s',
        algorithm: 'RS256',
      },
    }),
    UserModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(AuthMiddleware)
      .exclude({ path: 'auth/login', method: RequestMethod.ALL })
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
