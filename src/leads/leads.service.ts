import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Leads } from '@prisma/client';
import { CreateLeadDTO, GetLeadsQuery } from './dto/createLeads.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class LeadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly users: UsersService,
    private readonly logger: Logger,
  ) {}

  async create(data: CreateLeadDTO, timezone: string): Promise<void> {
    try {
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
      this.logger.log(`Lead - ${lead_name} created successfully`);
      const currentZone = await this.prisma.timeZones.findUnique({
        where: { timezone },
        select: { id: true },
      });
      await this.users.create({
        username: lead_name,
        password: lead_name,
        role: 'lead',
        time_id: currentZone.id.toString(),
      });
      this.logger.log(`lead - ${lead_name} credentials generated !!!`);
    } catch (err) {
      this.logger.error('Error', err.stack);
    }
  }

  async get(query: GetLeadsQuery) {
    const {
      call_freq,
      last_call_date,
      limit = 10,
      offset = 0,
      mgr_id,
      lead_id,
      today,
      searchName,
    } = query;
    const where: any = {};

    if (call_freq) where.call_freq = call_freq;
    if (last_call_date) where.last_call_date = last_call_date;
    if (mgr_id) where.mgr_id = Number(mgr_id);
    if (lead_id) where.lead_id = Number(lead_id);
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
    try {
      await this.prisma.leads.update({
        where: { id },
        data: {
          lead_status: true,
        },
      });
      this.logger.log(`Lead - ${id} - activated successfully`);
    } catch (err) {
      this.logger.error('Error', err.stack);
    }
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
      this.logger.log(`lead - ${lead_id} call history updated`);
    } catch (err) {
      this.logger.error('Error', err.stack);
      throw new Error('Failed to find Lead');
    }
  }
}
