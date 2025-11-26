import { IsString, IsDateString, IsNumber, Min, IsEnum, IsOptional } from 'class-validator';

export class CreateBookingDto {
  @IsString()
  tutorId: string;

  @IsDateString()
  scheduledAt: string;

  @IsNumber()
  @Min(30)
  durationMinutes: number;

  @IsOptional()
  @IsString()
  lessonType?: string;

  @IsOptional()
  @IsString()
  message?: string;
}

export class RescheduleBookingDto {
  @IsDateString()
  scheduledAt: string;
}

export class CancelBookingDto {
  @IsString()
  reason: string;
}

