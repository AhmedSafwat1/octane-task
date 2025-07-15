import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Book } from './book.entity';

@Entity()
export class ReadingInterval {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  user_id: number;

  @Column()
  start_page: number;

  @Column()
  end_page: number;

  @ManyToOne(() => Book, book => book.intervals, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'book_id' })
  book: Book;

  @Column({ type: 'int' })
  book_id: number;
}
