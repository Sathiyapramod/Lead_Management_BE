import { Injectable } from '@nestjs/common';
import { createOrderDTO, GetOrdersQuery } from './dto/create-order.dto';

import { PrismaService } from 'src/prisma/prisma.service';
import { updateOrderDTO } from './dto/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(order: createOrderDTO) {
    const { lead_id, placed_on, order_value, isCreated, isApproved } = order;
    await this.prisma.leads.update({
      where: { id: lead_id },
      data: {
        orders_placed: {
          increment: 1,
        },
      },
    });
    return await this.prisma.orders.create({
      data: {
        lead_id,
        placed_on: new Date(placed_on),
        order_value,
        isCreated,
        isApproved,
      },
    });
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
    }));
    return { orders: newOrders, count, active, pending: count - active };
  }

  async findOne(id: number) {
    return await this.prisma.orders.findFirst({ where: { id } });
  }

  async update(id: number, body: updateOrderDTO) {
    const { isCreated = true, isApproved, lead_id, approved_on } = body;
    const data: any = {};
    if (isCreated) data.isCreated = isCreated;
    if (isApproved) data.isApproved = isApproved;
    if (lead_id) data.lead_id = lead_id;
    if (approved_on) data.approved_on = new Date(approved_on);

    await this.prisma.leads.update({
      where: { id: lead_id },
      data: {
        orders_done: {
          increment: 1,
        },
      },
    });

    return await this.prisma.orders.update({
      where: { id },
      data: {
        ...data,
      },
    });
  }
}
