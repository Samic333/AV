import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { Public } from '../common/decorators/public.decorator';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('classes')
export class ClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Public()
  @Get()
  async findAll() {
    return this.classesService.findAll();
  }

  @Public()
  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.classesService.findById(id);
  }

  @Post(':id/enroll')
  @UseGuards(JwtAuthGuard)
  async enroll(@Param('id') id: string, @CurrentUser() user: any) {
    if (user.role !== 'student') {
      throw new Error('Only students can enroll');
    }
    return this.classesService.enroll(id, user.id);
  }
}
