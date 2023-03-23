import { Module } from '@nestjs/common';

import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { UsersController } from '../user/user.controller';
import { UserModule } from '../user/user.module';
import { JwtStrategy } from './jwt.strategy';

@Module({
  imports: [UserModule],
  providers: [ClientService, JwtStrategy],
  controllers: [ClientController, UsersController],
})
export class ClientModule {}
