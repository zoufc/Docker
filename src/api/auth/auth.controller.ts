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
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { logger } from 'src/utils/logger/logger';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async create(@Body() createAuthDto: CreateAuthDto, @Res() res) {
    try {
      logger.info(`---AUTH.CONTROLLER.LOGIN INIT---`);
      const user = await this.authService.login(createAuthDto);
      logger.info(`---AUTH.CONTROLLER.LOGIN SUCCESS---`);
      return res.status(HttpStatus.OK).json(user);
    } catch (error) {
      logger.info(`---AUTH.CONTROLLER.LOGIN ERROR ${error} ---`);
      return res.status(error.status).json(error);
    }
  }

  @Get()
  findAll() {}

  @Get(':id')
  findOne(@Param('id') id: string) {}

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAuthDto: UpdateAuthDto) {}

  @Delete(':id')
  remove(@Param('id') id: string) {}
}
