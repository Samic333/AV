import { Controller, Get, Put, Post, Body, Param, UseGuards } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('admin')
@UseGuards(JwtAuthGuard)
@Roles('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('dashboard/stats')
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('tutors/pending')
  async getPendingTutors() {
    return this.adminService.getPendingTutors();
  }

  @Put('tutors/:id/approve')
  async approveTutor(@Param('id') id: string, @CurrentUser() user: any) {
    return this.adminService.approveTutor(id, user.id);
  }

  @Put('tutors/:id/reject')
  async rejectTutor(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.adminService.rejectTutor(id, body.reason);
  }

  @Get('bookings')
  async getAllBookings() {
    return this.adminService.getAllBookings();
  }

  @Get('payments/transactions')
  async getAllTransactions() {
    return this.adminService.getAllTransactions();
  }

  @Get('payments/payouts')
  async getPayoutRequests() {
    return this.adminService.getPayoutRequests();
  }

  @Put('payments/payouts/:id/process')
  async processPayout(@Param('id') id: string, @CurrentUser() user: any) {
    return this.adminService.processPayout(id, user.id);
  }

  @Get('classes/pending')
  async getPendingClasses() {
    return this.adminService.getPendingClasses();
  }

  @Put('classes/:id/approve')
  async approveClass(@Param('id') id: string, @CurrentUser() user: any) {
    return this.adminService.approveClass(id, user.id);
  }

  @Put('classes/:id/reject')
  async rejectClass(@Param('id') id: string) {
    return this.adminService.rejectClass(id);
  }
}
