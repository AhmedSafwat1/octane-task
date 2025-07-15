import { IsString, IsInt, Min, IsNotEmpty } from 'class-validator';
import { Transform } from 'class-transformer';
import { Exists } from '../../common/validators/exists.validator';
import { Book } from '../entities/book.entity';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @Exists(Book, 'name', { message: 'Book with this name already exists' })
  name: string;

  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value))
  numOfPages: number;
} 