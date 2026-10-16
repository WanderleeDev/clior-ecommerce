import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AUTH_ROLES_KEY } from './roles.decorator';
import type { AuthUser } from '../../../../domain/models/auth-user';
import type { Request } from 'express';

type AuthenticatedRequest = Request & { user?: AuthUser };

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>(AUTH_ROLES_KEY, [context.getHandler(), context.getClass()]);
    if (!roles?.length) return true;
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();

    // 401 vs 403: no authenticated user means the request was never authenticated
    // (the role check must not run first), while an authenticated user without the
    // required role falls through to Nest's ForbiddenException (403).
    if (!request.user) {
      throw new UnauthorizedException('Authenticate first');
    }

    return roles.includes(request.user.role);
  }
}
