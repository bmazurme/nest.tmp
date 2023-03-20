import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';

import { UserService } from './user.service';

@Controller('api')
export class UsersController {
  constructor(private userService: UserService) {}

  @Get('users')
  @UseGuards(AuthGuard('jwt'))
  async findAll() {
    return await this.userService.findAll();
  }

  @Get('users/:id')
  @UseGuards(AuthGuard('jwt'))
  async getUser(@Param('id') id) {
    return await this.userService.findById(id);
  }
}
