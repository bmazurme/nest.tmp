import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from '../common/user';

import sendMail from '../common/sendMail';
import getToken from '../common/utils/getToken';

import { RESET } from '../common/constant';

export interface Payload {
  email: string;
  password: string;
  newPassword?: string;
}

@Injectable()
export class PasswordService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async update(payload: Payload) {
    const { email, password, newPassword } = payload;
    const user = await this.userModel.findOne({ email }).select('+password');

    if (!user) {
      throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
    }

    const matched = bcrypt.compare(password, user.password);

    if (!matched) {
      return Promise.reject(new Error('Incorrect email or password'));
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user?.save();

    return this.sanitizeUser(user);
  }

  async reset(payload: Payload) {
    const { email } = payload;
    const user = await this.userModel.findOne({ email });

    if (!user) {
      throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
    }

    const token = getToken();
    user.confirmationCode = token;
    user.status = 'Pending';
    user.save();
    sendMail(email, token, 'login', RESET);

    return { message: 'message was sent' };
  }

  async new(payload: Payload & { token: string }) {
    const { email, password, token } = payload;
    const user = await this.userModel
      .findOne({ email })
      .select('+confirmationCode');

    if (!user) {
      throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
    }

    if (user.status === 'Pending' && user.confirmationCode === token) {
      user.password = await bcrypt.hash(password, 10);
      user.status = 'Active';
      user.save();

      return this.sanitizeUser(user);
    }

    throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
  }

  sanitizeUser(user: User) {
    const sanitized = user.toObject();
    delete sanitized['password'];
    delete sanitized['confirmationCode'];

    return sanitized;
  }
}
