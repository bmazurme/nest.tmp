import { Controller, Get, Param } from '@nestjs/common';

import { UserService } from './user.service';

@Controller('api')
export class UsersController {
  constructor(private userService: UserService) {}

  @Get('users')
  async findAll() {
    const users = await this.userService.findAll();

    return users;
  }

  @Get('users/:id')
  async getUser(@Param('id') id) {
    const user = await this.userService.findById(id);

    return user;
  }
}
