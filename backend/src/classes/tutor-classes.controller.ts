import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ClassesService } from './classes.service';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('tutor/classes')
@UseGuards(JwtAuthGuard)
@Roles('tutor')
export class TutorClassesController {
  constructor(private readonly classesService: ClassesService) {}

  @Get()
  async findAll(@CurrentUser() user: any) {
    const tutor = await this.classesService['prisma'].tutorProfile.findUnique({
      where: { userId: user.id },
    });

    if (!tutor) {
      throw new Error('Tutor profile not found');
    }

    return this.classesService['prisma'].groupClass.findMany({
      where: { tutorId: tutor.id },
      include: {
        enrollments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  @Post()
  async create(@CurrentUser() user: any, @Body() data: any) {
    const tutor = await this.classesService['prisma'].tutorProfile.findUnique({
      where: { userId: user.id },
    });

    if (!tutor) {
      throw new Error('Tutor profile not found');
    }

    return this.classesService.create(tutor.id, data);
  }
}

