import { Injectable } from '@nestjs/common';
import { GetOrdersQuery } from './dto/create-order.dto';

import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  create() {
    return 'This action adds a new order';
  }

  async findAll(query: GetOrdersQuery) {
    const { limit = 10, offset = 0 } = query;
    const orders = await this.prisma.orders.findMany({
      take: Number(limit) ?? 10,
      skip: Number(offset) ?? 0,

      include: {
        lead: {
          select: {
            lead_name: true,
          },
        },
      },
    });
    const count = await this.prisma.orders.count();
    const active = await this.prisma.orders.count({
      where: {
        isCreated: true,
        isApproved: false,
      },
    });
    const newOrders = orders.map((odr) => ({
      ...odr,
      lead_name: odr.lead.lead_name,
    }));
    return { orders: newOrders, count, active, pending: count - active };
  }

  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
