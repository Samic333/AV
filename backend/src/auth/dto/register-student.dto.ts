import { IsEmail, IsString, MinLength, IsOptional, IsArray } from 'class-validator';

export class RegisterStudentDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(8)
  password: string;

  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsString()
  learningGoals?: string;

  @IsOptional()
  @IsString()
  experienceLevel?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  preferredLanguages?: string[];
}

