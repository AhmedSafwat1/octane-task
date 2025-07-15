import { Injectable } from '@nestjs/common';
import { SubmitIntervalDto } from './dto/submit-interval.dto';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { ReadingInterval } from './entities/reading-interval.entity';
import { Book } from './entities/book.entity';
import { RecommendedBookDto } from './dto/recommended-book.dto';
import { plainToInstance } from 'class-transformer';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';


@Injectable()
export class BookService {
    constructor(
        @InjectRepository(Book)
        private bookRepository: Repository<Book>,
        @InjectRepository(ReadingInterval)
        private readingIntervalRepository: Repository<ReadingInterval> ,
        @InjectDataSource()
        private dataSource: DataSource ,
        @InjectQueue('reading-interval')
        private readonly readingQueue: Queue,
    ) {}

    async submitInterval(submitIntervalDto: SubmitIntervalDto) {
        // Create and save the reading interval
        const readingInterval = this.readingIntervalRepository.create(submitIntervalDto);
        await this.readingIntervalRepository.save(readingInterval);

        // I follow the approach to enhance the performance for query when get Most Recommended Five Books.
        // i expected api most Most Recommended Five Books will be called frequently so i need to enhance the performance.
        // i use bullmq to handle the job to update unique_read_pages column in the books table.
        await this.readingQueue.add('submit-reading', submitIntervalDto);
       
    }
    async getMostRecommendedFiveBooks(): Promise<RecommendedBookDto[]> {
        const books = await this.bookRepository.find({
            select: ['id', 'name', 'numOfPages', 'uniqueReadPages'],
            order: {
                uniqueReadPages: 'DESC'
            },
            take: 5
        });
        return plainToInstance(RecommendedBookDto, books, { excludeExtraneousValues: true });
    }
}
