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
import { ProductNotFoundError } from '../../../modules/products/domain/product';

type DomainError = Error & { constructor: typeof Error };

const domainErrorStatuses = new Map<Function, HttpStatus>([
  [EmailAlreadyRegisteredError, HttpStatus.CONFLICT],
  [InvalidCredentialsError, HttpStatus.UNAUTHORIZED],
  [AccountLockedError, HttpStatus.UNAUTHORIZED],
  [EmailNotVerifiedError, HttpStatus.FORBIDDEN],
  [InvalidOneTimeTokenError, HttpStatus.BAD_REQUEST],
  [InvalidRefreshTokenError, HttpStatus.UNAUTHORIZED],
  [UserNotFoundError, HttpStatus.UNAUTHORIZED],
  [ProductNotFoundError, HttpStatus.NOT_FOUND],
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
      const status = domainErrorStatuses.get(exception.constructor);

      if (status !== undefined) {
        response.status(status).json({ statusCode: status, message: exception.message });
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
