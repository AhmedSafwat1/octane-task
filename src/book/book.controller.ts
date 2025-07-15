import { Body, Controller, Get, Post } from '@nestjs/common';
import { BookService } from './book.service';
import { SubmitIntervalDto } from './dto/submit-interval.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { RecommendedBookDto } from './dto/recommended-book.dto';

@ApiTags('Books V1')
@Controller('v1/book')
export class BookController {
    constructor(private readonly bookService: BookService) {}

    @Post('submit-interval')
    @ApiOperation({ summary: 'Submit a reading interval for a book' })
    async submitInterval(@Body() submitIntervalDto: SubmitIntervalDto) {
        await this.bookService.submitInterval(submitIntervalDto);
        return { status_code: 'success' };
    }

    @Get('most-recommended-five-books')
    @ApiOperation({ summary: 'Get the most recommended five books based on unique read pages' })
    @ApiResponse({
        status: 200,
        description: 'Returns the top 5 most read books',
        type: [RecommendedBookDto]
    })
    async getMostRecommendedFiveBooks(): Promise<RecommendedBookDto[]> {
        return this.bookService.getMostRecommendedFiveBooks();
    }
}