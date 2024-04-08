import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { Payload } from './payload';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { logger } from 'src/utils/logger/logger';
import * as bcrypt from 'bcrypt';
import { UserService } from '../user/user.service';
import { User } from '../user/interfaces/user.interface';

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
      const sanitizedUser = await this.sanitizeUser(user);
      return { sanitizedUser, token };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
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

  async sanitizeUser(user: User) {
    try {
      const sanitizeUser = {
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      };
      return sanitizeUser;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async cryptPassword(password: string) {
    try {
      const cryptedPassword = bcrypt.hash(password, process.env.SALT_ROUNDS);
      return cryptedPassword;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }
}
