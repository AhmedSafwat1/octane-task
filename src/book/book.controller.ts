import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { BookService } from './book.service';
import { SubmitIntervalDto } from './dto/submit-interval.dto';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RecommendedBookDto } from './dto/recommended-book.dto';
import { AuthGuard } from '@nestjs/passport';
import { SubmitIntervalAuthDto } from './dto/submit-interval-auth.dto';
import { Roles } from '../auth/decorator/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { StoreBookDto } from './dto/store-book.dto ';
import { RequestWithUser } from '../common/interfaces/request.interface';

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
  @ApiOperation({
    summary: 'Get the most recommended five books based on unique read pages',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns the top 5 most read books',
    type: [RecommendedBookDto],
  })
  async getMostRecommendedFiveBooks(): Promise<RecommendedBookDto[]> {
    return this.bookService.getMostRecommendedFiveBooks();
  }

  @Post('submit-interval-by-auth-user')
  @ApiOperation({
    summary: 'Submit a reading interval for a book by authenticated user',
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'))
  @ApiResponse({
    status: 200,
    description: 'Returns the status of the submission',
    type: String,
  })
  async submitIntervalByAuthUser(
    @Body() submitIntervalDto: SubmitIntervalAuthDto,
    @Request() req: RequestWithUser,
  ) {
    submitIntervalDto.user_id = req.user.id;
    await this.bookService.submitInterval(submitIntervalDto);
    return { status_code: 'success' };
  }

  @Post('store-book-by-admin-user')
  @ApiOperation({ summary: 'Store a book by admin user' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async storeBookByAdminUser(@Body() storeBookDto: StoreBookDto) {
    await this.bookService.storeBook(storeBookDto);
    return { status_code: 'success' };
  }

  @Put('update-book-by-admin-user/:id')
  @ApiOperation({ summary: 'Update a book by admin user' })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('admin')
  async updateBookByAdminUser(
    @Param('id') bookId: number,
    @Body() updateBookDto: StoreBookDto,
  ) {
    await this.bookService.updateBook(bookId, updateBookDto);
    return { status_code: 'success' };
  }
}
