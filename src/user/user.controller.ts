import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from './entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { RequestWithUser } from '../common/interfaces/request.interface';

@Controller('v1/users')
@ApiTags('users v1')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @ApiOperation({ summary: 'Get user profile' })
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: 200,
    description: 'User profile',
    type: User,
  })
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Request() req: RequestWithUser): User {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = req.user;
    return Object.assign(new User(), userWithoutPassword) as User;
  }
}
