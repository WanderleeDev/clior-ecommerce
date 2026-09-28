import { IsEmail, IsNotEmpty, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

const PASSWORD_POLICY = {
  minLength: 8,
  minLowercase: 1,
  minUppercase: 1,
  minNumbers: 1,
  minSymbols: 1,
} as const;

export function normalizeEmail(value: unknown): string {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

export class RegisterDto {
  @ApiProperty({ example: 'Maria Lopez' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name!: string;

  @IsEmail()
  @MaxLength(254)
  @Transform(({ value }) => normalizeEmail(value))
  @ApiProperty({ example: 'maria@gmail.com' })
  email!: string;

  @IsString()
  @MaxLength(128)
  @ApiProperty({ minLength: 8, example: 'Secure-password1!' })
  @IsStrongPassword(PASSWORD_POLICY)
  password!: string;
}

export class LoginDto {
  @IsEmail()
  @MaxLength(254)
  @Transform(({ value }) => normalizeEmail(value))
  @ApiProperty({ example: 'maria@gmail.com' })
  email!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(128)
  @ApiProperty({ minLength: 1, example: 'Secure-password1!' })
  password!: string;
}

export class TokenDto {
  @IsString()
  @MinLength(1)
  @MaxLength(256)
  @ApiProperty({ description: 'Opaque one-time token' })
  token!: string;
}

export class EmailDto {
  @IsEmail()
  @MaxLength(254)
  @Transform(({ value }) => normalizeEmail(value))
  @ApiProperty({ example: 'maria@gmail.com' })
  email!: string;
}

export class RefreshTokenDto extends TokenDto {}

export class ResetPasswordDto extends TokenDto {
  @IsString()
  @MaxLength(128)
  @IsStrongPassword(PASSWORD_POLICY)
  @ApiProperty({ minLength: 8, example: 'New-secure-password1!' })
  password!: string;
}

export class PublicUserDto {
  @ApiProperty({ example: '0f8b1c2e-4a5b-4c9d-8e7f-1a2b3c4d5e6f' })
  id!: string;

  @ApiProperty({ example: 'maria@gmail.com' })
  email!: string;

  @ApiProperty({ example: 'Maria Lopez' })
  name!: string;

  @ApiProperty({ example: 'customer' })
  role!: string;
}

export class LoginResponseDto {
  @ApiProperty({ description: 'JWT access token' })
  accessToken!: string;

  @ApiProperty({ type: PublicUserDto })
  user!: PublicUserDto;
}

export class CurrentUserDto extends PublicUserDto {
  @ApiProperty({ example: '2026-09-01T00:00:00.000Z' })
  createdAt!: Date;
}
