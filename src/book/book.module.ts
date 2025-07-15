import { Module, ValidationPipe } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { Book } from './entities/book.entity';
import { CommonModule } from '../common/common.module';
import { ReadingInterval } from './entities/reading-interval.entity';
import { IsInBookPageRangeValidator } from './validators/page-range.validator';
import { BullModule } from '@nestjs/bull';
import { ReadingIntervalProcessor } from './processor/reading-interval.processor';

@Module({
  imports: [
    TypeOrmModule.forFeature([Book, ReadingInterval]),
    CommonModule,
    BullModule.registerQueue({
      name: 'reading-interval',
    }),
  ],
  controllers: [BookController],
  providers: [
    BookService,
    IsInBookPageRangeValidator,   
    ReadingIntervalProcessor
  ],
  exports: [BookService, IsInBookPageRangeValidator],
})
export class BookModule {}
