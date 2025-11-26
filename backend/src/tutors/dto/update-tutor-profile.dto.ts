import { IsOptional, IsString, IsNumber, Min, IsArray } from 'class-validator';

export class UpdateTutorProfileDto {
  @IsOptional()
  @IsString()
  bio?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  hourlyRate?: number;

  @IsOptional()
  @IsString()
  introVideoUrl?: string;
}

export class AddSpecialtyDto {
  @IsString()
  specialty: string;

  @IsNumber()
  @Min(0)
  experienceYears: number;
}

export class AddAircraftTypeDto {
  @IsString()
  aircraftType: string;

  @IsNumber()
  @Min(0)
  hoursLogged: number;
}

export class AddLanguageDto {
  @IsString()
  languageCode: string;

  @IsString()
  proficiencyLevel: string;
}

export class SetAvailabilityDto {
  @IsArray()
  availability: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    timezone: string;
    isActive: boolean;
  }[];
}

