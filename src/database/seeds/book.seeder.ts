import { DataSource } from 'typeorm';
import { Book } from '../../book/entities/book.entity';

export const seedBooks = async (dataSource: DataSource) => {
  const bookRepository = dataSource.getRepository(Book);

  const books = [
    {
      name: 'The Great Gatsby',
      numOfPages: 180,
    },
    {
      name: '1984',
      numOfPages: 328,
    },
    {
      name: 'To Kill a Mockingbird',
      numOfPages: 281,
    },
    {
      name: 'Pride and Prejudice',
      numOfPages: 432,
    },
    {
      name: 'The Hobbit',
      numOfPages: 310,
    },
  ];

  for (const bookData of books) {
    const existingBook = await bookRepository.findOne({
      where: { name: bookData.name },
    });

    if (!existingBook) {
      const book = bookRepository.create(bookData);
      await bookRepository.save(book);
      console.log(`Added book: ${book.name}`);
    } else {
      console.log(`Book already exists: ${bookData.name}`);
    }
  }
}; 