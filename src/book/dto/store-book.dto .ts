import { IsString, IsInt, Min, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class StoreBookDto {
  @ApiProperty({
    description: 'The name of the book',
    example: 'The Great Gatsby'
  })
  @IsString() 
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'The number of pages in the book',
    example: 100
  })
  @IsInt()
  @Min(1)
  numOfPages: number;
} 