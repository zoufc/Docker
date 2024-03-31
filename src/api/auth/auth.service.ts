import { HttpException, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Payload } from './payload';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { logger } from 'src/utils/logger/logger';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
  ) {}
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  async signPayload(payload: Payload) {
    try {
      logger.info(`---AUTH.SERVICE.SIGN_PAYLOAD INIT---`);
      const token = this.jwtService.sign(payload, {
        secret: process.env.PRIVATE_KEY_DEV,
      });
      logger.info(`---AUTH.SERVICE.SIGN_PAYLOAD SUCCESS---`);
      return token;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async verifyToken(token: string) {
    try {
      logger.info(`---AUTH.SERVICE.VERIFY_TOKEN INIT---`);
      return this.jwtService.verify(token, {
        secret: process.env.PRIVATE_KEY_DEV,
      });
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }
}
