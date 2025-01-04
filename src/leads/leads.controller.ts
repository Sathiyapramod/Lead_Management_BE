import {
  Body,
  Controller,
  Param,
  Get,
  Delete,
  Post,
  Query,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LeadsService } from './leads.service';
import { Leads } from '@prisma/client';
import { CreateLeadDTO, GetLeadsQuery } from './dto/createLeads.dto';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/roles.decorator';
import { Roles as UserRoles } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/jwt.authguard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('leads')
@Controller('leads')
export class LeadsController {
  constructor(private readonly leadService: LeadsService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.KAM)
  @ApiOperation({ summary: 'Create Leads' })
  @ApiBearerAuth()
  async createLead(
    @Body()
    createLeadDto: CreateLeadDTO,
    @Req() req: any,
  ): Promise<void> {
    const { timezone } = req.user;
    return await this.leadService.create(createLeadDto, timezone);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get All Leads' })
  @ApiBearerAuth()
  async findAll(@Query() query: GetLeadsQuery) {
    return await this.leadService.get(query);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get Lead by id' })
  @ApiBearerAuth()
  async findByid(@Param('id') id: string): Promise<Leads> {
    return await this.leadService.getById(Number(id));
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update Lead by id' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.KAM)
  async updateLead(@Param('id') id: string) {
    return await this.leadService.activateLead(Number(id));
  }
  @Delete(':id')
  @ApiOperation({ summary: 'Delete Lead by id' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRoles.KAM)
  async deleteById(@Param('id') id: string): Promise<void> {
    return await this.leadService.remove(Number(id));
  }
}
