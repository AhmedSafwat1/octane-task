import { IsString, IsInt, Min, IsNotEmpty } from 'class-validator';
import { Exists } from '../../common/validators/exists.validator';
import { Book } from '../entities/book.entity';

export class CreateBookDto {
  @IsString()
  @IsNotEmpty()
  @Exists(Book, 'name', { message: 'Book with this name already exists' })
  name: string;

  @IsInt()
  @Min(1)
  numOfPages: number;
}
