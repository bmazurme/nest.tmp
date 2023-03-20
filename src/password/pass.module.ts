import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { PasswordService } from './pass.service';
import { PasswordController } from './pass.controller';

import { UserSchema } from '../schemas/user.schema';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'User', schema: UserSchema }])],
  providers: [PasswordService],
  controllers: [PasswordController],
})
export class PasswordModule {}
