import { Controller, Get, Put, Post, Body, Param, Query, UseGuards } from '@nestjs/common';
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
  async getAllTransactions(@Query() query: any) {
    return this.adminService.getAllTransactions(query.view, query.period, query.year);
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

  @Get('users')
  async getAllUsers(@Query() query: any) {
    return this.adminService.getAllUsers(query);
  }

  @Get('users/search')
  async searchUsers(@Query('q') query: string) {
    return this.adminService.searchUsers(query);
  }

  @Post('users/bulk-action')
  async bulkAction(@Body() body: { userIds: string[]; action: string }) {
    return this.adminService.bulkAction(body.userIds, body.action);
  }

  @Get('users/:id')
  async getUserDetails(@Param('id') id: string) {
    return this.adminService.getUserDetails(id);
  }

  @Put('users/:id/suspend')
  async suspendUser(@Param('id') id: string, @Body() body: { reason: string }) {
    return this.adminService.suspendUser(id, body.reason);
  }

  @Post('announcements')
  async sendAnnouncement(
    @Body() body: { target: 'all' | 'students' | 'instructors' | string; title: string; message: string },
  ) {
    return this.adminService.sendAnnouncement(body.target, body.title, body.message);
  }

  @Get('financials/summary')
  async getFinancialSummary(@Query() query: any) {
    return this.adminService.getFinancialSummary(query.view, query.period, query.year);
  }

  @Get('financials/expenses')
  async getExpenses(@Query() query: any) {
    return this.adminService.getExpenses(query.view, query.period, query.year);
  }

  @Post('financials/expenses')
  async createExpense(@CurrentUser() user: any, @Body() body: any) {
    return this.adminService.createExpense({
      ...body,
      date: new Date(body.date),
      createdBy: user.id,
    });
  }

  @Get('messages/flagged')
  async getFlaggedMessages() {
    return this.adminService.getFlaggedMessages();
  }
}
