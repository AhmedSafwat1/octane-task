import 'dotenv/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { Book } from '../book/entities/book.entity';
import { User } from '../user/entities/user.entity';

const options: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.POSTGRES_PORT || '5432', 10),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities: [Book, User],
  synchronize: true, // Be careful with this in production
};

export const AppDataSource = new DataSource(options); 