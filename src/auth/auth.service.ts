import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcrypt';
import { TimeZones } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
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
    return {
      access_token: await this.jwtService.signAsync(payload),
      username: user.username,
      role: user.role,
      userId: user.id,
      timezone: user.TimeZones.timezone,
    };
  }

  async logout() {
    return { message: 'Logged Out Successfully 👍' };
  }

  async getZones(): Promise<TimeZones[]> {
    return await this.prisma.timeZones.findMany();
  }
}
