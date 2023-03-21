import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PasswordService } from './password.service';
import { PasswordController } from './password.controller';

import { UserSchema } from '../schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [PasswordService],
  controllers: [PasswordController],
})
export class PasswordModule {}
