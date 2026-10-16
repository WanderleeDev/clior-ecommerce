import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { EmailDto, LoginDto, RegisterDto } from './auth.dto';

function transformedEmail(
  dtoClass: new () => { email: string },
  payload: Record<string, unknown>,
): string {
  return plainToInstance(dtoClass, payload).email;
}

describe('Auth DTO email normalization (M13)', () => {
  it('trims and lowercases the email in RegisterDto at the boundary', () => {
    expect(
      transformedEmail(RegisterDto, {
        name: 'Maria',
        email: '  Maria@Gmail.COM ',
        password: 'Secure-password1!',
      }),
    ).toBe('maria@gmail.com');
  });

  it('trims and lowercases the email in LoginDto at the boundary', () => {
    expect(transformedEmail(LoginDto, { email: ' MARIA@GMAIL.COM ', password: 'Secret1!' })).toBe(
      'maria@gmail.com',
    );
  });

  it('trims and lowercases the email in EmailDto at the boundary', () => {
    expect(transformedEmail(EmailDto, { email: 'MARIA@Gmail.com' })).toBe('maria@gmail.com');
  });

  it('keeps the normalized email valid for the class-validator rules', () => {
    const instance = plainToInstance(RegisterDto, {
      name: 'Maria',
      email: '  Maria@Gmail.COM ',
      password: 'Secure-password1!',
    });

    expect(validateSync(instance)).toEqual([]);
  });
});
