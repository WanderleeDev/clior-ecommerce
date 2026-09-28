import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { AUTH_ROLES_KEY } from './roles.decorator';

function createExecutionContext(handler: Function, user?: { role: string }): ExecutionContext {
  return {
    getHandler: () => handler,
    getClass: () => class TestController {},
    switchToHttp: () => ({ getRequest: () => (user ? { user } : {}) }),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let adminRoute: Function;

  beforeEach(() => {
    guard = new RolesGuard(new Reflector());
    adminRoute = () => undefined;
    Reflect.defineMetadata(AUTH_ROLES_KEY, ['admin'], adminRoute);
  });

  it('answers 401 Unauthorized when the request has no authenticated user', () => {
    // H5(a): an unauthenticated request must not be reported as "forbidden",
    // otherwise clients cannot tell "log in" from "you may never do this".
    const context = createExecutionContext(adminRoute);

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('answers 403 Forbidden (false) when the user lacks the required role', () => {
    const context = createExecutionContext(adminRoute, { role: 'customer' });

    expect(guard.canActivate(context)).toBe(false);
  });

  it('allows an authenticated user holding the required role', () => {
    const context = createExecutionContext(adminRoute, { role: 'admin' });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('skips routes without role metadata regardless of authentication', () => {
    const openRoute = () => undefined;

    expect(guard.canActivate(createExecutionContext(openRoute))).toBe(true);
  });
});
