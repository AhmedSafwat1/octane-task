import { Entity, PrimaryGeneratedColumn, Column , OneToMany, Index} from 'typeorm';
import { ReadingInterval } from '../../user/entities/reading-interval.entity';

@Entity('books')
export class Book {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  name: string;

  @Column({ type: 'integer', name: 'num_of_pages' })
  numOfPages: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
  updatedAt: Date;

  @OneToMany(() => ReadingInterval, interval => interval.book)
  intervals: ReadingInterval[];

  @Column({ type: 'integer', unsigned: true, name: 'unique_read_pages', default: 0 })
  @Index('idx_unique_read_pages')
  uniqueReadPages: number;

  @Column({ type: 'timestamp', nullable: true, name: 'last_update_unique_read_pages' })
  lastUpdateUniqueReadPages: Date;
} 