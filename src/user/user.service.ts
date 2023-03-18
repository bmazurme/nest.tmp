import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User } from '../common/user';
import { RegisterDTO } from '../common/dto/register.dto';
import { LoginDTO } from '../common/dto/login.dto';
import { Payload } from '../common/payload';

@Injectable()
export class UserService {
  constructor(@InjectModel('User') private userModel: Model<User>) {}

  async create(RegisterDTO: RegisterDTO) {
    const { email } = RegisterDTO;
    const user = await this.userModel.findOne({ email });

    if (user) {
      throw new HttpException('user already exists', HttpStatus.BAD_REQUEST);
    }

    const createdUser = new this.userModel(RegisterDTO);
    await createdUser.save();

    return this.sanitizeUser(createdUser);
  }

  async findByPayload(payload: Payload) {
    const { email } = payload;

    return await this.userModel.findOne({ email });
  }

  async findAll() {
    return await this.userModel.find({});
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id);

    if (!user) {
      throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
    }

    return user;
  }

  async findByLogin(UserDTO: LoginDTO) {
    const { email, password } = UserDTO;
    const user = await this.userModel.findOne({ email }).select('+password');

    if (!user) {
      throw new HttpException('user doesnt exists', HttpStatus.BAD_REQUEST);
    }

    console.log(UserDTO, user, password, user.password);
    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user);
    } else {
      throw new HttpException('invalid credential', HttpStatus.BAD_REQUEST);
    }
  }

  sanitizeUser(user: User) {
    const sanitized = user.toObject();
    delete sanitized['password'];

    return sanitized;
  }
}
