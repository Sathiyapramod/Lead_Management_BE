import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUser.dto';
import { Users, Roles } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  async create(credentials: CreateUserDto): Promise<Users> {
    const { username, password, role, time_id } = credentials;
    const hashedPassword = await bcrypt.hash(password, 10);
    const data = await this.prisma.users.create({
      data: {
        username,
        password: hashedPassword,
        role: Roles[role],
        time_id: Number(time_id),
      },
    });
    this.logger.log(`User - ${username} Created Successfully`);
    return data;
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
