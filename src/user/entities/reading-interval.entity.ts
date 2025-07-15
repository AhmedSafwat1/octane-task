import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Book } from '../../book/entities/book.entity';

@Entity()
export class ReadingInterval {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  start_page: number;

  @Column()
  end_page: number;

  @ManyToOne(() => Book, book => book.intervals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column()
  book_id: number;
}
