import { Injectable } from '@nestjs/common';
import { CreateManagerDto } from './dto/create-manager.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Managers } from '@prisma/client';

@Injectable()
export class ManagersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createManagerDto: CreateManagerDto) {
    const { mgr_name, role, phone } = createManagerDto;
    return await this.prisma.managers.create({
      data: { mgr_name, role, phone },
    });
  }

  async findAll(): Promise<Managers[]> {
    return await this.prisma.managers.findMany();
  }

  async findOne(id: number): Promise<Managers> {
    return await this.prisma.managers.findUnique({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.managers.delete({ where: { id } });
  }
}
