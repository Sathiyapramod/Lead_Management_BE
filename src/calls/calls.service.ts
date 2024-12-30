import { Injectable } from '@nestjs/common';
import { Leads } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CallsService {
  constructor(private readonly prisma: PrismaService) {}
  async getCallScheduleByDate(query: Record<string, string>) {
    try {
      const { limit = 10, offset = 0, date } = query;
      const today = new Date(date);
      //  finding dates from the leadList
      const leads = await this.prisma.leads.findMany({
        where: {
          lead_status: true,
        },
        take: Number(limit) ?? 10,
        skip: Number(offset) ?? 0,
      });
      const revisedLeads = leads.filter((lead) =>
        this.isDateIncluded(lead, today),
      );
      const completedCalls = leads.filter((lead) =>
        this.isCallCompleted(lead, today),
      );
      return {
        count: revisedLeads.length,
        completed: completedCalls.length,
        leads: revisedLeads,
      };
    } catch (err) {
      console.log(err);
      throw new Error('Failed to find Lead');
    }
  }
  private isCallCompleted(lead: Leads, today: Date) {
    const { last_call_date } = lead;
    return last_call_date === today;
  }
  private isDateIncluded(lead: Leads, today: Date) {
    const { last_call_date, call_freq } = lead;
    if (call_freq === 'daily') return true;
    else if (call_freq === 'weekly')
      return this.isWithinThisWeek(last_call_date, today);
    return false;
  }
  private isWithinThisWeek(last_call_date: Date, today: Date): boolean {
    const sevenDaysAgo = new Date(today);
    sevenDaysAgo.setDate(today.getDate() - 7);

    return last_call_date >= sevenDaysAgo && last_call_date <= today;
  }
}
