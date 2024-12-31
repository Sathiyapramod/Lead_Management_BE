import { Injectable } from '@nestjs/common';
import { CreateManagerDto, GetManagersQuery } from './dto/create-manager.dto';
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

  async findAll(query: GetManagersQuery) {
    const { limit = 10, offset = 0, searchName = '' } = query;
    const managers = await this.prisma.managers.findMany({
      where: {
        mgr_name: {
          contains: searchName,
        },
      },
      include: {
        _count: true,
      },
      take: Number(limit) ?? 10,
      skip: Number(offset) ?? 0,
    });
    const count = await this.prisma.managers.count();
    const mgrs = managers.map((mgr) => ({ ...mgr, leads: mgr._count.leads }));
    return { managers: mgrs, count, active: count, pending: 0 };
  }

  async findOne(id: number): Promise<Managers> {
    return await this.prisma.managers.findUnique({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.managers.delete({ where: { id } });
  }

  async findKAMByPhoneNo(phone: string): Promise<{ id: number }> {
    try {
      return await this.prisma.managers.findFirst({
        where: { phone },
        select: { id: true },
      });
    } catch (err) {
      console.log(err);
      throw new Error('Failed to find Lead');
    }
  }
}
