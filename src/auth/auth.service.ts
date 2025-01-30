import { Injectable, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import * as bcrypt from 'bcrypt';
import { TimeZones } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { MenuService } from '../menu/menu.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
    private readonly menuService: MenuService,
  ) {}

  async validateUser({ username, password }) {
    const user = await this.usersService.findOne(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
    return null;
  }

  async login(user) {
    const payload = {
      username: user.username,
      userId: user.id,
      role: user.role,
      timezone: user.TimeZones.timezone,
    };
    this.logger.log('User Logged in Successfully');
    return {
      access_token: await this.jwtService.signAsync(payload),
      username: user.username,
      role: user.role,
      userId: user.id,
      timezone: user.TimeZones.timezone,
      menu: await this.menuService.getMenuByRole(user.role),
    };
  }

  async logout() {
    this.logger.log('User Logged out successfully');
    return { message: 'Logged Out Successfully 👍' };
  }

  async getZones(): Promise<TimeZones[]> {
    return await this.prisma.timeZones.findMany();
  }
}
