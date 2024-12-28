import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUser.dto';
import { Users, Roles } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(credentials: CreateUserDto): Promise<Users> {
    const { username, password, role, time_id } = credentials;
    const hashedPassword = await bcrypt.hash(password, 10);
    return await this.prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        role: Roles[role],
        time_id: Number(time_id),
      },
    });
  }

  async findOne(username: string) {
    return this.prisma.users.findUnique({
      where: { username },
      include: {
        TimeZones: {
          select: {
            timezone: true,
          },
        },
      },
    });
  }
}
