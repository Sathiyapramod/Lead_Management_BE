import { Logger, Module } from '@nestjs/common';
import { MenuService } from './menu.service';

@Module({
  providers: [MenuService, Logger],
})
export class MenuModule {}
