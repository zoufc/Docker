import { HttpException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './interfaces/user.interface';
import { AuthService } from '../auth/auth.service';
import { logger } from 'src/utils/logger/logger';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<User>,
    private authService: AuthService,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      logger.info(`---USER.SERVICE.CREATE INIT---`);
      const user = await this.userModel.create(createUserDto);
      const payload = { email: user.email };
      const token = await this.authService.signPayload(payload);
      logger.info(`---USER.SERVICE.CREATE SUCCESS---`);
      return { user, token };
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  async findAll() {
    try {
      const users = await this.userModel.find().exec();
      return users;
    } catch (error) {
      throw new HttpException(error.message, error.status);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
