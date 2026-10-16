import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import type { Response } from 'express';
import { AccountLockedError, EmailNotVerifiedError, InvalidOneTimeTokenError, InvalidRefreshTokenError } from '../../../modules/auth/domain/errors/auth-flow.errors';
import { EmailAlreadyRegisteredError } from '../../../modules/auth/domain/errors/email-already-registered.error';
import { InvalidCredentialsError } from '../../../modules/auth/domain/errors/invalid-credentials.error';
import { UserNotFoundError } from '../../../modules/auth/domain/errors/user-not-found.error';
import { ProductNotFoundError } from '../../../modules/products/domain/errors/product.errors';

type DomainErrorMapping = { status: HttpStatus; publicMessage: string };

// Known domain errors are answered with a FIXED public message per error
// class: the detailed `exception.message` (internal flow context such as
// refresh-token reuse reasons) is kept for logs only and never serialized
// into the HTTP response.
const domainErrorMappings = new Map<Function, DomainErrorMapping>([
  [EmailAlreadyRegisteredError, { status: HttpStatus.CONFLICT, publicMessage: 'Email is already registered' }],
  [InvalidCredentialsError, { status: HttpStatus.UNAUTHORIZED, publicMessage: 'Invalid credentials' }],
  [AccountLockedError, { status: HttpStatus.UNAUTHORIZED, publicMessage: 'Account is temporarily locked' }],
  [EmailNotVerifiedError, { status: HttpStatus.FORBIDDEN, publicMessage: 'Email address must be verified before login' }],
  [InvalidOneTimeTokenError, { status: HttpStatus.BAD_REQUEST, publicMessage: 'Invalid or expired token' }],
  [InvalidRefreshTokenError, { status: HttpStatus.UNAUTHORIZED, publicMessage: 'Invalid refresh token' }],
  [UserNotFoundError, { status: HttpStatus.UNAUTHORIZED, publicMessage: 'User not found' }],
  [ProductNotFoundError, { status: HttpStatus.NOT_FOUND, publicMessage: 'Product not found' }],
]);

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const response = host.switchToHttp().getResponse<Response>();

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(exception.getResponse());
      return;
    }

    if (exception instanceof Error) {
      const mapping = domainErrorMappings.get(exception.constructor);

      if (mapping !== undefined) {
        // Detailed domain message stays in the logs; the client gets the
        // fixed generic message for its error class.
        this.logger.warn(`${exception.name}: ${exception.message}`);
        response.status(mapping.status).json({ statusCode: mapping.status, message: mapping.publicMessage });
        return;
      }

      this.logger.error(exception.message, exception.stack);
    } else {
      this.logger.error('Unknown non-Error exception', String(exception));
    }

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      message: 'Internal server error',
    });
  }
}
