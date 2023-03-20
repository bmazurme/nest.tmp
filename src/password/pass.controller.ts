import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { PasswordService } from './pass.service';

type DataDTO = {
  email: string;
  password: string;
  newPassword?: string;
};

@Controller('api/password')
export class PasswordController {
  constructor(private passwordService: PasswordService) {}

  @Post('update')
  @UseGuards(AuthGuard('jwt'))
  async update(@Body() dataDTO: DataDTO) {
    return await this.passwordService.update(dataDTO);
  }

  @Post('reset')
  async reset(@Body() dataDTO: DataDTO) {
    return await this.passwordService.reset(dataDTO);
  }

  @Post('new')
  async new(@Body() dataDTO: DataDTO & { token: string }) {
    return await this.passwordService.new(dataDTO);
  }
}
