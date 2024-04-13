import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { logger } from 'src/utils/logger/logger';
import { Roles } from '../auth/roles/role.decorator';
import { Role } from '../auth/roles/role.enum';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto, @Res() res) {
    try {
      logger.info(`---USER.CONTROLLER.CREATE INIT---`);
      const user = await this.userService.create(createUserDto);
      logger.info(`---USER.CONTROLLER.CREATE SUCCESS---`);
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      logger.error(`---USER.CONTROLLER.CREATE ERROR ${error} ---`);
      return res.status(error.status).json(error);
    }
  }

  @Roles(Role.admin)
  @Get('find')
  async findAll(@Res() res) {
    try {
      logger.info(`---USER.CONTROLLER.FIND_ALL INIT---`);
      const users = await this.userService.findAll();
      logger.info(`---USER.CONTROLLER.FIND_ALL SUCCESS---`);
      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
      logger.info(`---USER.CONTROLLER.FIND_ALL ERROR ${error}---`);
      return res.status(error.status).json(error);
    }
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
