import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Payload } from './payload';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { logger } from 'src/utils/logger/logger';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { User } from '../user/interfaces/user.interface';
import { sanitizeUser } from 'src/utils/functions';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
  ) {}
  create(createAuthDto: CreateAuthDto) {
    return 'This action adds a new auth';
  }

  async login(authDto: CreateAuthDto) {
    try {
      const user = await this.userService.findByEmail(authDto.email);
      const isPasswordMatched = await bcrypt.compare(
        authDto.password,
        user.password,
      );
      if (!isPasswordMatched) {
        throw new HttpException(
          'Email or password invalid',
          HttpStatus.UNAUTHORIZED,
        );
      }
      const payload = { email: user.email };
      const token = await this.signPayload(payload);
      const sanitizedUser = await sanitizeUser(user);
      return { sanitizedUser, token };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findByEmail(email: string) {
    try {
      const user = await this.userService.findByEmail(email);
      return user;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async signPayload(payload: Payload) {
    try {
      logger.info(`---AUTH.SERVICE.SIGN_PAYLOAD INIT---`);
      const token = this.jwtService.sign(payload, {
        secret: process.env.PRIVATE_KEY_DEV,
        expiresIn: '1d',
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
      logger.error(`---AUTH.SERVICE.VERIFY_TOKEN ERROR ${error} ---`);
      throw new HttpException(error.message, error.status);
    }
  }

  // async validateToken(token:string)
  // {
  //   try {
  //     logger.info(`---AUTH.SERVICE.VALIDATE_TOKEN INIT---`);
  //   } catch (error) {

  //   }
  // }

  async cryptPassword(password: string) {
    try {
      const cryptedPassword = bcrypt.hash(password, process.env.SALT_ROUNDS);
      return cryptedPassword;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
