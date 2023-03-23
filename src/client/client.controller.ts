import { Body, Controller, Post, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { UserService } from '../user/user.service';
import { ClientService } from './client.service';

import { LoginDTO } from '../common/dto/login.dto';

@Controller('api/client')
export class ClientController {
  constructor(
    private userService: UserService,
    private authService: ClientService,
  ) {}

  @Post('signin')
  async signIn(@Body() loginDTO: LoginDTO) {
    const { email } = await this.userService.findByLogin(loginDTO);
    const payload = { email };
    const token = await this.authService.signPayload(payload);

    return { token };
  }

  @Post('me')
  @UseGuards(AuthGuard('jwt'))
  async getMe(@Request() req) {
    return req.user;
  }
}
