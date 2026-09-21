import { IsEmail, IsString, IsStrongPassword, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ example: 'Maria Lopez' })
  @IsString()
  @MinLength(2)
  name!: string;

  @IsEmail()
  @ApiProperty({ example: 'maria@example.com' })
  email!: string;

  @IsString()
  @ApiProperty({ minLength: 8, example: 'Secure-password1!' })
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password!: string;
}

export class LoginDto {
  @IsEmail()
  @ApiProperty({ example: 'maria@example.com' })
  email!: string;

  @IsString()
  @MinLength(1)
  @ApiProperty({ minLength: 1, example: 'Secure-password1!' })
  password!: string;
}

export class TokenDto {
  @IsString()
  @MinLength(1)
  @ApiProperty({ description: 'Opaque one-time token' })
  token!: string;
}

export class EmailDto {
  @IsEmail()
  @ApiProperty({ example: 'maria@example.com' })
  email!: string;
}

export class RefreshTokenDto extends TokenDto {}

export class ResetPasswordDto extends TokenDto {
  @IsString()
  @IsStrongPassword({
    minLength: 12,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  @ApiProperty({ minLength: 12, example: 'New-secure-password1!' })
  password!: string;
}
