import { ApiProperty } from '@nestjs/swagger';

export class UserDto {
  @ApiProperty({
    example: 1,
    description: 'User ID'
  })
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address'
  })
  email: string;

  @ApiProperty({
    example: 'John Doe',
    description: 'User full name'
  })
  name: string;

  @ApiProperty({
    example: ['user'],
    description: 'User roles',
    type: [String]
  })
  roles: string[];
}

export class LoginResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token'
  })
  access_token: string;

  @ApiProperty({
    description: 'User information',
    type: UserDto
  })
  user: UserDto;
} 