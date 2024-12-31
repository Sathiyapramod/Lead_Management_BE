import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Leads } from '@prisma/client';
import { CreateLeadDTO, GetLeadsQuery } from './dto/createLeads.dto';

@Injectable()
export class LeadsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateLeadDTO): Promise<void> {
    const {
      lead_name,
      rest_name,
      rest_addr1,
      rest_addr2,
      lead_status,
      mgr_id,
      phone,
      orders_placed,
      orders_done,
      call_freq,
    } = data;

    const managerExists = await this.prisma.managers.findUnique({
      where: { id: mgr_id },
    });

    if (!managerExists) {
      throw new NotFoundException(`Manager with ID ${mgr_id} not found`);
    }
    await this.prisma.leads.create({
      data: {
        lead_name,
        rest_name,
        rest_addr1,
        rest_addr2,
        lead_status,
        mgr_id,
        phone,
        orders_placed,
        orders_done,
        call_freq,
      },
    });
  }

  async get(query: GetLeadsQuery) {
    const {
      call_freq,
      last_call_date,
      limit = 10,
      offset = 0,
      mgr_id,
      today,
      searchName,
    } = query;
    const where: any = {};

    if (call_freq) where.call_freq = call_freq;
    if (last_call_date) where.last_call_date = last_call_date;
    if (mgr_id) where.mgr_id = Number(mgr_id);

    if (today) {
      // current date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      // last week date
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);
      where.OR = [
        {
          last_call_date: {
            lt: today,
          },
          call_freq: 'daily',
        },
        {
          last_call_date: {
            lt: sevenDaysAgo,
          },
          call_freq: 'weekly',
        },
        {
          last_call_date: null,
        },
      ];
    }
    if (searchName) where.lead_name = { startsWith: searchName };
    const count = await this.prisma.leads.count();
    const leads = await this.prisma.leads.findMany({
      where,
      take: Number(limit) ?? 10,
      skip: Number(offset) ?? 0,
    });
    return { count, leads };
  }

  async getById(id: number): Promise<Leads> {
    return await this.prisma.leads.findUnique({ where: { id } });
  }

  async remove(id: number): Promise<void> {
    await this.prisma.leads.delete({ where: { id } });
  }

  async activateLead(id: number): Promise<void> {
    await this.prisma.leads.update({
      where: { id },
      data: {
        lead_status: true,
      },
    });
  }

  async findLeadByPhoneNo(phone: string): Promise<{ id: number }> {
    try {
      return await this.prisma.leads.findFirst({
        where: { phone },
        select: { id: true },
      });
    } catch (err) {
      console.log(err);
      throw new Error('Failed to find Lead');
    }
  }

  async updateCallHistory(lead_id: number, last_call_date: Date) {
    try {
      await this.prisma.leads.update({
        where: { id: lead_id },
        data: {
          last_call_date,
        },
      });
    } catch (err) {
      console.log(err);
      throw new Error('Failed to find Lead');
    }
  }
}
