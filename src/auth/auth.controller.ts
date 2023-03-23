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
  async signUp(@Body() registerDTO: RegisterDTO) {
    const user = await this.userService.create(registerDTO);

    return { user };
  }

  @Post('signin')
  async signIn(@Body() loginDTO: LoginDTO, @Response() res) {
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
  async getMe(@Request() req) {
    return req.user;
  }

  @Get('signout')
  @UseGuards(AuthGuard('jwt'))
  async signOut(@Request() req, @Response() res) {
    await req.logout();
    res.clearCookie('jwt', { path: '/', httpOnly: true });
    res.clearCookie('jwt.sig', { path: '/', httpOnly: true });

    return res.redirect('/');
  }

  @Get('confirm/:code')
  async getUser(@Param('code') code) {
    return await this.userService.confirmEmail(code);
  }
}
