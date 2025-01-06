import { Injectable, Logger } from '@nestjs/common';
import { createOrderDTO, GetOrdersQuery } from './dto/create-order.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { updateOrderDTO } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly logger: Logger,
  ) {}

  async create(order: createOrderDTO) {
    try {
      const { lead_id, placed_on, order_value, isCreated, isApproved } = order;
      await this.prisma.leads.update({
        where: { id: lead_id },
        data: {
          orders_placed: {
            increment: 1,
          },
        },
      });
      const data = await this.prisma.orders.create({
        data: {
          lead_id,
          placed_on: new Date(placed_on),
          order_value,
          isCreated,
          isApproved,
        },
      });
      this.logger.log(`Order - ${data.id} created successfully`);
      return data;
    } catch (err) {
      this.logger.error('Error', err.stack);
    }
  }

  async findAll(query: GetOrdersQuery) {
    const { limit = 10, offset = 0, lead_name = '' } = query;

    const where: any = {};
    if (lead_name) {
      const data = await this.prisma.leads.findFirst({
        where: { lead_name },
      });
      where.lead_id = data['id'];
    }
    const orders = await this.prisma.orders.findMany({
      take: Number(limit) ?? 10,
      skip: Number(offset) ?? 0,
      where,
      include: {
        lead: {
          select: {
            lead_name: true,
            manager: {
              select: {
                mgr_name: true,
              },
            },
          },
        },
      },
      orderBy: {
        updated_at: 'desc',
      },
    });
    const count = await this.prisma.orders.count();
    const active = await this.prisma.orders.count({
      where: {
        isCreated: true,
        isApproved: true,
      },
    });
    const newOrders = orders.map((odr) => ({
      ...odr,
      lead_name: odr.lead.lead_name,
      mgr_name: odr.lead.manager.mgr_name,
    }));
    return { orders: newOrders, count, active, pending: count - active };
  }

  async findOne(id: number) {
    const result = await this.prisma.orders.findFirst({
      where: { id },
      include: {
        lead: {
          select: {
            lead_name: true,
            manager: {
              select: {
                mgr_name: true,
              },
            },
          },
        },
      },
    });
    return {
      ...result,
      lead_name: result.lead.lead_name,
      mgr_name: result.lead.manager,
    };
  }

  async update(id: number, body: updateOrderDTO) {
    try {
      const {
        isCreated = true,
        isApproved,
        lead_id,
        approved_on,
        closed_on,
      } = body;
      const data: any = {};
      if (isCreated) data.isCreated = isCreated;
      if (isApproved) data.isApproved = isApproved;
      if (lead_id) data.lead_id = lead_id;
      if (approved_on) data.approved_on = new Date(approved_on);
      if (closed_on) data.closed_on = new Date(closed_on);

      await this.prisma.leads.update({
        where: { id: lead_id },
        data: {
          orders_done: {
            increment: 1,
          },
        },
      });

      await this.prisma.orders.update({
        where: { id },
        data: {
          ...data,
        },
      });
      this.logger.log(`Order - ${id} updated successfully`);
    } catch (err) {
      this.logger.error('Error', err.stack);
    }
  }
}
