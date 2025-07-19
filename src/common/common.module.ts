import { Module } from '@nestjs/common';
import { ExistsValidator } from './validators/exists.validator';

@Module({
  providers: [ExistsValidator],
  exports: [ExistsValidator],
})
export class CommonModule {}
