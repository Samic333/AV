import { IsEmail, IsString, MinLength, IsOptional, IsNumber, Min } from 'class-validator';

export class RegisterTutorDto {
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
  bio?: string;

  @IsNumber()
  @Min(0)
  hourlyRate: number;
}

