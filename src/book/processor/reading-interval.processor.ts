import { SubmitIntervalDto } from './../dto/submit-interval.dto';
import { Process, Processor } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
import { DataSource } from 'typeorm';

@Processor('reading-interval')
export class ReadingIntervalProcessor {
  private readonly logger = new Logger(ReadingIntervalProcessor.name);

  constructor(private readonly dataSource: DataSource) {}

  @Process('submit-reading')
  async handleSubmitReading(job: Job<SubmitIntervalDto>) {
    const { user_id, book_id, start_page, end_page } = job.data;

    const pagesValues: string[] = [];
    for (let i = start_page; i <= end_page; i++) {
      pagesValues.push(`(${user_id}, ${book_id}, ${i})`);
    }

    const pagesValuesString = pagesValues.join(',');

    await this.dataSource.transaction(async (manager) => {
      await manager.query(
        `SELECT id FROM books WHERE id = $1 FOR UPDATE`,
        [book_id],
      );

      await manager.query(`
        INSERT INTO user_book_pages (user_id, book_id, page_number)
        VALUES ${pagesValuesString}
        ON CONFLICT DO NOTHING
      `);

      await manager.query(`
        UPDATE books
        SET unique_read_pages = (
          SELECT COUNT(DISTINCT page_number)
          FROM user_book_pages
          WHERE book_id = $1
        )
        WHERE id = $1
      `, [book_id]);
    }).then(() => {
      this.logger.log(`Reading interval submitted for book ${book_id}`);
    }).catch((error) => {
      this.logger.error(`Error submitting reading interval for book ${book_id}: ${error}`);
      throw error;
    });
  }
}
