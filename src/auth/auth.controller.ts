import { Post, Body, UnauthorizedException, Get } from '@nestjs/common';
import { Controller } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { CreateUserDto } from 'src/users/dto/createUser.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userservice: UsersService,
  ) {}

  @Post('login')
  async login(@Body() cred: { username: string; password: string }) {
    const { username, password } = cred;
    const user = await this.authService.validateUser({ username, password });
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }
  @Post('register')
  async register(
    @Body()
    cred: CreateUserDto,
  ) {
    const { username, password, role, time_id } = cred;
    return this.userservice.create({ username, password, role, time_id });
  }

  @Post('logout')
  async logout() {
    return this.authService.logout();
  }

  @Get('timezones')
  async getZones() {
    return await this.authService.getZones();
  }
}
