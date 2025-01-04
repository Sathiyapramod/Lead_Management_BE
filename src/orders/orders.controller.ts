import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { createOrderDTO, GetOrdersQuery } from './dto/create-order.dto';
import { updateOrderDTO } from './dto/update-order.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Roles as UserRoles } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt.authguard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.KAM)
  @ApiOperation({ summary: 'Create Order' })
  @ApiBearerAuth()
  create(@Body() body: createOrderDTO) {
    return this.ordersService.create(body);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get All orders' })
  @ApiBearerAuth()
  async findAll(@Query() query: GetOrdersQuery) {
    return await this.ordersService.findAll(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get order by id' })
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.ordersService.findOne(+id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update order by id' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.KAM)
  update(@Param('id') id: string, @Body() updateOrderDto: updateOrderDTO) {
    return this.ordersService.update(+id, updateOrderDto);
  }
}
