import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt.authguard';
import { PerformanceService } from './performance.service';

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Get('analytics')
  @UseGuards(JwtAuthGuard)
  async getList() {
    return await this.performanceService.getAnalytics();
  }

  @Get('leads')
  @UseGuards(JwtAuthGuard)
  async getLeads() {
    return await this.performanceService.getLeads();
  }

  @Get('orders')
  async getOrders() {
    return await this.performanceService.getOrders();
  }
  @Get('managers')
  @UseGuards(JwtAuthGuard)
  async getMgrs() {
    return await this.performanceService.getMgrs();
  }

  @Get('stats')
  @UseGuards(JwtAuthGuard)
  async getStats() {
    return await this.performanceService.getStats();
  }

  @Get('report')
  @UseGuards(JwtAuthGuard)
  async getReport() {
    return await this.performanceService.getReport();
  }
}
