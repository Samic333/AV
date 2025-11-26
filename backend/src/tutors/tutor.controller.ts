import { Controller, Get, Put, Post, Body, UseGuards } from '@nestjs/common';
import { TutorsService } from './tutors.service';
import { UpdateTutorProfileDto, AddSpecialtyDto, AddAircraftTypeDto, AddLanguageDto, SetAvailabilityDto } from './dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('tutor')
@UseGuards(JwtAuthGuard)
@Roles('tutor')
export class TutorController {
  constructor(private readonly tutorsService: TutorsService) {}

  @Get('profile')
  async getProfile(@CurrentUser() user: any) {
    return this.tutorsService.getTutorProfile(user.id);
  }

  @Put('profile')
  async updateProfile(@CurrentUser() user: any, @Body() dto: UpdateTutorProfileDto) {
    return this.tutorsService.updateProfile(user.id, dto);
  }

  @Post('profile/specialty')
  async addSpecialty(@CurrentUser() user: any, @Body() dto: AddSpecialtyDto) {
    return this.tutorsService.addSpecialty(user.id, dto);
  }

  @Post('profile/aircraft-type')
  async addAircraftType(@CurrentUser() user: any, @Body() dto: AddAircraftTypeDto) {
    return this.tutorsService.addAircraftType(user.id, dto);
  }

  @Post('profile/language')
  async addLanguage(@CurrentUser() user: any, @Body() dto: AddLanguageDto) {
    return this.tutorsService.addLanguage(user.id, dto);
  }

  @Get('availability')
  async getAvailability(@CurrentUser() user: any) {
    const tutor = await this.tutorsService.getTutorProfile(user.id);
    return this.tutorsService.getAvailability(tutor.id);
  }

  @Put('availability')
  async setAvailability(@CurrentUser() user: any, @Body() dto: SetAvailabilityDto) {
    return this.tutorsService.setAvailability(user.id, dto);
  }
}

