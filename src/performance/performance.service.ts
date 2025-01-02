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
    return await this.prisma.leads.findMany({
      select: {
        id: true,
        lead_name: true,
      },
    });
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
      closed: order_pending,
    };
  }
}
