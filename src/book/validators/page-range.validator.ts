import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Book } from '../entities/book.entity';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';

@ValidatorConstraint({ name: 'IsInBookPageRange', async: true })
@Injectable()
export class IsInBookPageRangeValidator implements ValidatorConstraintInterface {
  constructor(
    @InjectRepository(Book)
    private readonly bookRepository: Repository<Book>
  ) {}

  async validate(endPage: number, args: ValidationArguments) {
    try {
      const { book_id, start_page } = args.object as any;
      if(start_page > endPage) return false;
      if (!book_id) return false;

      const book = await this.bookRepository.findOne({ where: { id: book_id } });
      
      if (!book) return false;
      
      // Check if end_page is greater than or equal to start_page and within book's page range
      return endPage <= book.numOfPages;
    } catch (error) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const { start_page } = args.object as any;
    return `End page must be greater than or equal to start page (${start_page}) and within the book's page range`;
  }
}