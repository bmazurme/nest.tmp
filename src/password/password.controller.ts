import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport/dist/auth.guard';
import { PasswordService } from './password.service';
import { UserDTO } from '../common/dto/user.dto';

@Controller('api/password')
export class PasswordController {
  constructor(private passwordService: PasswordService) {}

  @Post('update')
  @UseGuards(AuthGuard('jwt'))
  async update(@Body() dataDTO: UserDTO) {
    return await this.passwordService.update(dataDTO);
  }

  @Post('reset')
  async reset(@Body() dataDTO: UserDTO) {
    return await this.passwordService.reset(dataDTO);
  }

  @Post('new')
  async new(@Body() dataDTO: UserDTO & { token: string }) {
    return await this.passwordService.new(dataDTO);
  }
}
