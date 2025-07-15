import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class RecommendedBookDto {
    @ApiProperty({ example: '1' })
    @Expose({ name: 'id' })
    book_id: number;

    @ApiProperty({ example: 'test3' })
    @Expose({ name: 'name' })
    book_name: string;

    @ApiProperty({ example: 100 })
    @Expose({ name: 'numOfPages' })
    num_of_pages: number;

    @ApiProperty({ example: 90 })
    @Expose({ name: 'uniqueReadPages' })
    num_of_read_pages: number;
} 