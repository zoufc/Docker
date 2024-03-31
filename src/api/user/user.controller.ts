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

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('create')
  async create(@Body() createUserDto: CreateUserDto, @Res() res) {
    try {
      logger.info(`---USER.CONTROLLER.SERVICE INIT---`);
      const user = await this.userService.create(createUserDto);
      logger.info(`---USER.CONTROLLER.SERVICE SUCCESS---`);
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      logger.error(`---USER.CONTROLLER.SERVICE ERROR ${error} ---`);
      return res.status(error.status).json(error);
    }
  }

  @Get('find')
  async findAll(@Res() res) {
    try {
      const users = await this.userService.findAll();
      return res.status(HttpStatus.OK).json(users);
    } catch (error) {
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
