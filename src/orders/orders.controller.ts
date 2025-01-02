import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { createOrderDTO, GetOrdersQuery } from './dto/create-order.dto';
import { updateOrderDTO } from './dto/update-order.dto';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  create(@Body() body: createOrderDTO) {
    return this.ordersService.create(body);
  }

  @Get()
  async findAll(@Query() query: GetOrdersQuery) {
    return await this.ordersService.findAll(query);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrderDto: updateOrderDTO) {
    return this.ordersService.update(+id, updateOrderDto);
  }
}
