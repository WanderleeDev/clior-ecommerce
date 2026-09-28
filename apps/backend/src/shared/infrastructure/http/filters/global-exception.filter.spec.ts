import { ArgumentsHost, ConflictException, HttpStatus } from '@nestjs/common';
import { EmailAlreadyRegisteredError } from '../../../../modules/auth/domain/errors/email-already-registered.error';
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
});
