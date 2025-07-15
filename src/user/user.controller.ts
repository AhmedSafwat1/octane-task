import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';

@Controller('v1/users')
@ApiTags('users v1')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get("profile")
  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'User profile',
    type: User
  })
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req): Promise<User> {
    delete req.user.password;
    return req.user;
  }
} 