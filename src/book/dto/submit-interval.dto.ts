import { IsInt, Min } from 'class-validator';
import { Exists } from '../../common/validators/exists.validator';
import { Book } from '../entities/book.entity';
import { User } from '../../user/entities/user.entity';
import { IsInBookPageRange } from '../validators/page-range.decorator';
import { ApiProperty } from '@nestjs/swagger';

export class SubmitIntervalDto {
  @ApiProperty({
    description: 'The ID of the user submitting the reading interval',
    example: 1,
  })
  @IsInt()
  @Exists(User, 'id')
  user_id: number;

  @ApiProperty({
    description: 'The ID of the book being read',
    example: 1,
  })
  @IsInt()
  @Exists(Book, 'id')
  book_id: number;

  @ApiProperty({
    description: 'The starting page number of the reading interval',
    minimum: 1,
    example: 1,
  })
  @IsInt()
  @Min(1)
  start_page: number;

  @ApiProperty({
    description:
      'The ending page number of the reading interval (must be greater than or equal to start_page and within book page range)',
    example: 10,
  })
  @IsInt()
  @IsInBookPageRange()
  end_page: number;
}
