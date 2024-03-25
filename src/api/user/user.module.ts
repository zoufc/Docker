import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { UserSchema } from './schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ schema: UserSchema, name: 'User' }])],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
