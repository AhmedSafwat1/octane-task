import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Book } from './entities/book.entity';
import { ReadingInterval } from './entities/reading-interval.entity';
import { DataSource, Repository } from 'typeorm';
import { getQueueToken } from '@nestjs/bull';
import { Queue } from 'bull';
import { NotFoundException } from '@nestjs/common';
import { RecommendedBookDto } from './dto/recommended-book.dto';

describe('BookService', () => {
  let service: BookService;
  let bookRepository: Repository<Book>;
  let readingIntervalRepository: Repository<ReadingInterval>;
  let dataSource: DataSource;
  let readingQueue: Queue;

  const mockBookRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  };

  const mockReadingIntervalRepository = {
    create: jest.fn(),
    save: jest.fn(),
  };

  const mockDataSource = {
    transaction: jest.fn(),
  };

  const mockQueue = {
    add: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookService,
        {
          provide: getRepositoryToken(Book),
          useValue: mockBookRepository,
        },
        {
          provide: getRepositoryToken(ReadingInterval),
          useValue: mockReadingIntervalRepository,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
        {
          provide: getQueueToken('reading-interval'),
          useValue: mockQueue,
        },
      ],
    }).compile();

    service = module.get<BookService>(BookService);
    bookRepository = module.get<Repository<Book>>(getRepositoryToken(Book));
    readingIntervalRepository = module.get<Repository<ReadingInterval>>(
      getRepositoryToken(ReadingInterval),
    );
    dataSource = module.get<DataSource>(DataSource);
    readingQueue = module.get<Queue>(getQueueToken('reading-interval'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('submitInterval', () => {
    const submitIntervalDto = {
      user_id: 1,
      book_id: 1,
      start_page: 1,
      end_page: 10,
    };

    it('should submit reading interval and add job to queue', async () => {
      const mockReadingInterval = { ...submitIntervalDto, id: 1 };
      mockReadingIntervalRepository.create.mockReturnValue(mockReadingInterval);
      mockReadingIntervalRepository.save.mockResolvedValue(mockReadingInterval);
      mockQueue.add.mockResolvedValue(undefined);

      await service.submitInterval(submitIntervalDto);

      expect(mockReadingIntervalRepository.create).toHaveBeenCalledWith(
        submitIntervalDto,
      );
      expect(mockReadingIntervalRepository.save).toHaveBeenCalledWith(
        mockReadingInterval,
      );
      expect(mockQueue.add).toHaveBeenCalledWith(
        'submit-reading',
        submitIntervalDto,
      );
    });

    it('should throw error if saving reading interval fails', async () => {
      mockReadingIntervalRepository.save.mockRejectedValue(new Error('Save failed'));

      await expect(service.submitInterval(submitIntervalDto)).rejects.toThrow(
        'Save failed',
      );
    });
  });

  describe('getMostRecommendedFiveBooks', () => {
    it('should return top 5 books ordered by uniqueReadPages', async () => {
      const mockBooks = [
        { id: 1, name: 'Book 1', numOfPages: 100, uniqueReadPages: 50 },
        { id: 2, name: 'Book 2', numOfPages: 200, uniqueReadPages: 40 },
      ];

      mockBookRepository.find.mockResolvedValue(mockBooks);

      const result = await service.getMostRecommendedFiveBooks();

      expect(mockBookRepository.find).toHaveBeenCalledWith({
        select: ['id', 'name', 'numOfPages', 'uniqueReadPages'],
        order: { uniqueReadPages: 'DESC' },
        take: 5,
      });
      expect(result).toBeInstanceOf(Array);
      expect(result.length).toBe(2);
    });

    it('should return empty array when no books found', async () => {
      mockBookRepository.find.mockResolvedValue([]);

      const result = await service.getMostRecommendedFiveBooks();

      expect(result).toEqual([]);
    });
  });

  describe('storeBook', () => {
    const storeBookDto = {
      name: 'New Book',
      numOfPages: 100,
    };

    it('should successfully store a new book', async () => {
      const mockBook = { id: 1, ...storeBookDto };
      mockBookRepository.create.mockReturnValue(mockBook);
      mockBookRepository.save.mockResolvedValue(mockBook);

      const result = await service.storeBook(storeBookDto);

      expect(mockBookRepository.create).toHaveBeenCalledWith(storeBookDto);
      expect(mockBookRepository.save).toHaveBeenCalledWith(mockBook);
      expect(result).toEqual({ status_code: 'success' });
    });

    it('should throw error if saving book fails', async () => {
      mockBookRepository.save.mockRejectedValue(new Error('Save failed'));

      await expect(service.storeBook(storeBookDto)).rejects.toThrow('Save failed');
    });
  });

  describe('updateBook', () => {
    const bookId = 1;
    const updateBookDto = {
      name: 'Updated Book',
      numOfPages: 200,
    };

    it('should successfully update an existing book', async () => {
      const mockBook = { id: bookId, ...updateBookDto };
      mockBookRepository.findOne.mockResolvedValue(mockBook);
      mockBookRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.updateBook(bookId, updateBookDto);

      expect(mockBookRepository.findOne).toHaveBeenCalledWith({
        where: { id: bookId },
      });
      expect(mockBookRepository.update).toHaveBeenCalledWith(bookId, updateBookDto);
      expect(result).toEqual({ status_code: 'success' });
    });

    it('should throw NotFoundException when book not found', async () => {
      mockBookRepository.findOne.mockResolvedValue(null);

      await expect(service.updateBook(bookId, updateBookDto)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockBookRepository.update).not.toHaveBeenCalled();
    });

    it('should throw error if update fails', async () => {
      const mockBook = { id: bookId, ...updateBookDto };
      mockBookRepository.findOne.mockResolvedValue(mockBook);
      mockBookRepository.update.mockRejectedValue(new Error('Update failed'));

      await expect(service.updateBook(bookId, updateBookDto)).rejects.toThrow(
        'Update failed',
      );
    });
  });
});
