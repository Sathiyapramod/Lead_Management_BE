import { Controller, Get } from '@nestjs/common';
import { PerformanceService } from './performance.service';

@Controller('performance')
export class PerformanceController {
  constructor(private readonly performanceService: PerformanceService) {}

  @Get('analytics')
  async getList() {
    return await this.performanceService.getAnalytics();
  }

  @Get('leads')
  async getLeads() {
    return await this.performanceService.getLeads();
  }

  @Get('orders')
  async getOrders() {
    return await this.performanceService.getOrders();
  }
  @Get('managers')
  async getMgrs() {
    return await this.performanceService.getMgrs();
  }

  @Get('stats')
  async getStats() {
    return await this.performanceService.getStats();
  }

  @Get('report')
  async getReport() {
    return await this.performanceService.getReport();
  }
}
