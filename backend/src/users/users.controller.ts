import { Controller, Get, Put, Body, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() user: any) {
    return this.usersService.findById(user.id);
  }

  @Put('me')
  async updateProfile(@CurrentUser() user: any, @Body() data: any) {
    return this.usersService.updateProfile(user.id, data);
  }

  @Get('settings')
  async getSettings(@CurrentUser() user: any) {
    return this.usersService.getSettings(user.id);
  }

  @Put('settings')
  async updateSettings(@CurrentUser() user: any, @Body() data: any) {
    return this.usersService.updateSettings(user.id, data);
  }
}

