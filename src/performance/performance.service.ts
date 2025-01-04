import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class PerformanceService {
  constructor(private readonly prisma: PrismaService) {}

  async getAnalytics() {
    return await this.prisma.leads
      .findMany({
        select: {
          id: true,
          lead_name: true,
          rest_name: true,
          orders_placed: true,
          orders_done: true,
          last_call_date: true,
          Orders: {
            select: {
              id: true,
              order_value: true,
              isCreated: true,
              isApproved: true,
            },
          },
        },
        orderBy: {
          updated_at: 'desc',
        },
      })
      .then((leads) => {
        return leads.map((lead) => {
          const totalOrderValue = lead.Orders.reduce(
            (sum, order) => sum + order.order_value,
            0,
          );
          const closedOrderSum = lead.Orders.reduce(
            (sum, order) =>
              order.isCreated && order.isApproved
                ? sum + order.order_value
                : sum,
            0,
          );
          const pendingOrderSum = lead.Orders.reduce(
            (sum, order) =>
              order.isCreated && !order.isApproved
                ? sum + order.order_value
                : sum,
            0,
          );

          return {
            ...lead,
            totalOrderValue,
            closedOrderSum,
            pendingOrderSum,
          };
        });
      });
  }

  async getLeads() {
    const leads = await this.prisma.leads.findMany({
      select: {
        id: true,
        lead_name: true,
      },
    });

    const count = await this.prisma.leads.count();
    const active = await this.prisma.leads.count({
      where: {
        lead_status: true,
      },
    });
    const pending = Number(count) - Number(active);
    return { leads, count, active, pending };
  }

  async getOrders() {
    const orders = await this.prisma.orders.findMany({
      select: {
        id: true,
        order_value: true,
      },
    });
    const totalvalue = await this.prisma.orders.aggregate({
      _sum: {
        order_value: true,
      },
    });

    const order_closed = await this.prisma.orders.aggregate({
      where: {
        isCreated: true,
        isApproved: true,
      },
      _sum: {
        order_value: true,
      },
    });

    const order_pending =
      Number(totalvalue._sum.order_value) -
      Number(order_closed._sum.order_value);
    return {
      orders,
      count: orders.length,
      total: totalvalue._sum.order_value,
      active: order_closed._sum.order_value,
      pending: order_pending,
    };
  }

  async getMgrs() {
    const managers = await this.prisma.managers.findMany({
      select: {
        id: true,
        mgr_name: true,
      },
    });

    const count = await this.prisma.managers.count();

    return {
      managers,
      count,
    };
  }

  private async GetAmount(customDate: Date) {
    return await this.prisma.orders.groupBy({
      by: ['isApproved'],
      where: {
        placed_on: {
          gte: customDate,
        },
        isCreated: true,
      },
      _sum: {
        order_value: true,
      },
      _count: {
        id: true,
      },
    });
  }

  async getStats() {
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay());
    const startOfMonth = new Date(today.getFullYear(), today.getMonth() - 5, 1);

    const [weeklyStats, monthlyStats] = await Promise.all([
      this.GetAmount(startOfWeek),
      this.GetAmount(startOfMonth),
    ]);
    // return [weeklyStats, monthlyStats];

    const formatStats = (stats) => {
      const closed = stats.find((s) => s.isApproved)?._sum.order_value || 0;
      const pending = stats.find((s) => !s.isApproved)?._sum.order_value || 0;
      const count = stats.reduce((acc, s) => acc + s._count.id, 0);
      return { count, closed, pending };
    };
    return {
      weekly: formatStats(weeklyStats),
      monthly: formatStats(monthlyStats),
    };
  }

  async getReport() {
    const orders = await this.prisma.orders.findMany({
      where: {
        closed_on: { not: null }, // Only include orders that are closed
      },
      select: {
        id: true,
        placed_on: true,
        closed_on: true,
        order_value: true,
        approved_on: true,
        lead: {
          select: {
            lead_name: true,
            rest_name: true,
            Orders: {
              select: {
                order_value: true,
              },
            },
          },
        },
      },
    });

    const groupedOrders = {
      '3Days': [],
      '7Days': [],
      '14Days': [],
    };

    orders.forEach((order) => {
      const daysToClose = Math.ceil(
        (new Date(order.closed_on).getTime() -
          new Date(order.placed_on).getTime()) /
          (1000 * 60 * 60 * 24),
      );

      if (daysToClose <= 3) {
        groupedOrders['3Days'].push({
          lead_name: order.lead.lead_name,
          rest_name: order.lead.rest_name,
          placed_on: order.placed_on,
          approved_on: order.approved_on,
          order_value: order.lead.Orders.reduce(
            (acc, amt) => acc + amt.order_value,
            0,
          ),
        });
      } else if (daysToClose <= 7) {
        groupedOrders['7Days'].push({
          lead_name: order.lead.lead_name,
          rest_name: order.lead.rest_name,
          placed_on: order.placed_on,
          approved_on: order.approved_on,
          order_value: order.lead.Orders.reduce(
            (acc, amt) => acc + amt.order_value,
            0,
          ),
        });
      } else if (daysToClose <= 14) {
        groupedOrders['14Days'].push({
          lead_name: order.lead.lead_name,
          rest_name: order.lead.rest_name,
          placed_on: order.placed_on,
          approved_on: order.approved_on,
          order_value: order.lead.Orders.reduce(
            (acc, amt) => acc + amt.order_value,
            0,
          ),
        });
      }
    });

    return groupedOrders;
  }
}
