import { Injectable, Inject, OnModuleInit, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
@Injectable()
export class MenuService implements OnModuleInit {
  private readonly userMenus = {
    KAM: ['Home', 'Order', 'Lead', 'Contact'],
    lead: ['Order'],
    contact: ['Order'],
  };

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly logger: Logger,
  ) {}

  async onModuleInit() {
    await this.cacheManager.set('menus', this.userMenus);
    this.logger.log('✅ basic menus established and cached !!');
  }

  async getMenuByRole(role: string): Promise<string[]> {
    const usrMenu = await this.cacheManager.get('menus');
    if (usrMenu && usrMenu[role]) return usrMenu[role];
  }
}
