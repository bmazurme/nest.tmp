import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
  Param,
  Response,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { UserService } from '../user/user.service';
import { AuthService } from './auth.service';

import { RegisterDTO } from '../common/dto/register.dto';
import { LoginDTO } from '../common/dto/login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(
    private userService: UserService,
    private authService: AuthService,
  ) {}

  @Post('signup')
  async register(@Body() registerDTO: RegisterDTO) {
    const user = await this.userService.create(registerDTO);

    return { user };
  }

  @Post('signin')
  async login(@Body() loginDTO: LoginDTO) {
    const { email } = await this.userService.findByLogin(loginDTO);
    const payload = { email };
    const token = await this.authService.signPayload(payload);

    return { token };
  }

  @Post('signinwithcookie')
  async logint(@Body() loginDTO: LoginDTO, @Response() res) {
    try {
      const { email } = await this.userService.findByLogin(loginDTO);
      const payload = { email };
      const token = await this.authService.signPayload(payload);

      res.cookie('jwt', token, {
        expires: new Date(new Date().getTime() + 30 * 1000),
        // sameSite: 'strict',
        // httpOnly: true,
      });

      return res.send();
    } catch (error) {
      throw error;
    }
  }

  @Post('me')
  @UseGuards(AuthGuard('jwt'))
  async getMe(@Request() req: any) {
    return req.user;
  }

  @Get('confirm/:code')
  async getUser(@Param('code') code) {
    return await this.userService.confirmEmail(code);
  }
}
