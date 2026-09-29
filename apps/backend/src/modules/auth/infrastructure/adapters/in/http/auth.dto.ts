import { IsEmail, IsString, IsStrongPassword, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { normalizeEmail } from '../../../../domain/utils/normalize-email';

/**
 * M13: fold the address at the boundary so every downstream lookup, duplicate
 * check and unique constraint sees one canonical spelling. Runs before
 * `@IsEmail()`, so a padded mixed-case address is normalized rather than rejected.
 */
const foldEmail = ({ value }: { value: unknown }): unknown =>
  typeof value === 'string' ? normalizeEmail(value) : value;

export class RegisterDto {
  @ApiProperty({ example: 'Maria Lopez' })
  @IsString()
  @MinLength(2)
  name!: string;

  @Transform(foldEmail)
  @IsEmail()
  @ApiProperty({ example: 'maria@gmail.com' })
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
  @Transform(foldEmail)
  @IsEmail()
  @ApiProperty({ example: 'maria@gmail.com' })
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
  @Transform(foldEmail)
  @IsEmail()
  @ApiProperty({ example: 'maria@gmail.com' })
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
