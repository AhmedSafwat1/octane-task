import { DataSource } from 'typeorm';
import { User } from '../../user/entities/user.entity';

export const seedUsers = async (dataSource: DataSource) => {
  const userRepository = dataSource.getRepository(User);

  const users = [
    {
      name: 'Admin User',
      email: 'admin@admin.com',
      password: 'admin123',
      roles: ['admin', 'user'],
    },
    {
      name: 'User User',
      email: 'user@user.com',
      password: 'user123',
      roles: ['user'],
    },
  ];

  for (const userData of users) {
    const existingUser = await userRepository.findOne({
      where: { email: userData.email },
    });

    if (!existingUser) {
      const user = userRepository.create(userData);
      await userRepository.save(user);
      console.log(`Added user: ${user.name}`);
    } else {
      console.log(`User already exists: ${userData.email}`);
    }
  }
};
