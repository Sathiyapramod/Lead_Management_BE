import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ManagersService } from './managers.service';
import { CreateManagerDto } from './dto/create-manager.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.authguard';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Roles as UserRoles } from '@prisma/client';

@Controller('managers')
export class ManagersController {
  constructor(private readonly managersService: ManagersService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.KAM)
  create(@Body() createManagerDto: CreateManagerDto) {
    return this.managersService.create(createManagerDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll() {
    return this.managersService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string) {
    return this.managersService.findOne(+id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.KAM)
  remove(@Param('id') id: string) {
    return this.managersService.remove(+id);
  }
}
