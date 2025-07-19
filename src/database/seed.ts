import { AppDataSource } from './data-source';
import { seedBooks } from './seeds/book.seeder';
import { seedUsers } from './seeds/user.seeder';

async function main() {
  try {
    await AppDataSource.initialize();

    console.log('Starting database seeding...');

    console.log('\nSeeding books...');
    await seedBooks(AppDataSource);

    console.log('\nSeeding users...');
    await seedUsers(AppDataSource);

    console.log('\nSeeding completed successfully');
  } catch (error) {
    console.error('Error during seeding:', error);
    process.exit(1);
  } finally {
    await AppDataSource.destroy();
  }
}

void main();
