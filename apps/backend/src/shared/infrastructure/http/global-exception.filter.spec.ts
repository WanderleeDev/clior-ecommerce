import { ArgumentsHost, ConflictException, HttpStatus, Logger } from '@nestjs/common';
import { AccountLockedError, EmailNotVerifiedError, InvalidOneTimeTokenError, InvalidRefreshTokenError } from '../../../modules/auth/domain/errors/auth-flow.errors';
import { EmailAlreadyRegisteredError } from '../../../modules/auth/domain/errors/email-already-registered.error';
import { InvalidCredentialsError } from '../../../modules/auth/domain/errors/invalid-credentials.error';
import { UserNotFoundError } from '../../../modules/auth/domain/errors/user-not-found.error';
import { ProductNotFoundError } from '../../../modules/products/domain/errors/product.errors';
import { GlobalExceptionFilter } from './global-exception.filter';

function createHost() {
  const response = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };
  const host = {
    switchToHttp: () => ({ getResponse: () => response }),
  } as unknown as ArgumentsHost;

  return { host, response };
}

describe('GlobalExceptionFilter', () => {
  it('maps known domain errors to their HTTP status', () => {
    const filter = new GlobalExceptionFilter();
    const { host, response } = createHost();

    filter.catch(new EmailAlreadyRegisteredError(), host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.CONFLICT,
      message: 'Email is already registered',
    });
  });

  it('preserves Nest HTTP exception responses', () => {
    const filter = new GlobalExceptionFilter();
    const { host, response } = createHost();
    const exception = new ConflictException('Conflict');

    filter.catch(exception, host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.CONFLICT);
    expect(response.json).toHaveBeenCalledWith(exception.getResponse());
  });

  it('does not expose unexpected error details', () => {
    const filter = new GlobalExceptionFilter();
    const { host, response } = createHost();

    filter.catch(new Error('database password leaked'), host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  });

  it('answers with the fixed public message instead of the internal flow detail', () => {
    const filter = new GlobalExceptionFilter();
    const { host, response } = createHost();

    filter.catch(new InvalidRefreshTokenError('Refresh token reuse detected'), host);

    expect(response.status).toHaveBeenCalledWith(HttpStatus.UNAUTHORIZED);
    expect(response.json).toHaveBeenCalledWith({
      statusCode: HttpStatus.UNAUTHORIZED,
      message: 'Invalid refresh token',
    });
  });

  it('keeps the detailed domain message in the logs', () => {
    const warnSpy = jest.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);
    const filter = new GlobalExceptionFilter();
    const { host } = createHost();

    filter.catch(new InvalidRefreshTokenError('Refresh token reuse detected'), host);

    expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Refresh token reuse detected'));
    warnSpy.mockRestore();
  });

  it.each([
    [new EmailAlreadyRegisteredError(), HttpStatus.CONFLICT, 'Email is already registered'],
    [new InvalidCredentialsError(), HttpStatus.UNAUTHORIZED, 'Invalid credentials'],
    [new AccountLockedError(), HttpStatus.UNAUTHORIZED, 'Account is temporarily locked'],
    [new EmailNotVerifiedError(), HttpStatus.FORBIDDEN, 'Email address must be verified before login'],
    [new InvalidOneTimeTokenError(), HttpStatus.BAD_REQUEST, 'Invalid or expired token'],
    [new InvalidRefreshTokenError(), HttpStatus.UNAUTHORIZED, 'Invalid refresh token'],
    [new UserNotFoundError(), HttpStatus.UNAUTHORIZED, 'User not found'],
    [new ProductNotFoundError('p1'), HttpStatus.NOT_FOUND, 'Product not found'],
  ])('answers %s with a fixed public payload', (error, status, publicMessage) => {
    const filter = new GlobalExceptionFilter();
    const { host, response } = createHost();

    filter.catch(error, host);

    expect(response.status).toHaveBeenCalledWith(status);
    expect(response.json).toHaveBeenCalledWith({ statusCode: status, message: publicMessage });
  });
});
