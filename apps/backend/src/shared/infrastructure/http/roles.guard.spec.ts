import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard } from './roles.guard';
import { AUTH_ROLES_KEY } from './roles.decorator';

const handlerRef = function handler(): void {
  return undefined;
};
const classRef = class Controller {};

function createExecutionContext(user?: { role: string }): ExecutionContext {
  const request = { user };
  return {
    getHandler: () => handlerRef,
    getClass: () => classRef,
    switchToHttp: () => ({ getRequest: () => request }),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  let reflector: Reflector;
  let guard: RolesGuard;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('allows the request when the handler role is present', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
    const context = createExecutionContext({ role: 'admin' });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('rejects the request when the user role is not listed', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
    const context = createExecutionContext({ role: 'customer' });

    expect(guard.canActivate(context)).toBe(false);
  });

  it('throws Unauthorized when the user is not authenticated', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
    const context = createExecutionContext(undefined);

    expect(() => guard.canActivate(context)).toThrow(UnauthorizedException);
  });

  it('allows the request when no roles are declared', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(undefined);
    const context = createExecutionContext({ role: 'customer' });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('allows the request when an empty role list is declared', () => {
    jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue([]);
    const context = createExecutionContext({ role: 'customer' });

    expect(guard.canActivate(context)).toBe(true);
  });

  it('reads roles from the handler and class, handler taking precedence', () => {
    const getAllAndOverride = jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(['admin']);
    const context = createExecutionContext({ role: 'admin' });

    guard.canActivate(context);

    expect(getAllAndOverride).toHaveBeenCalledWith(AUTH_ROLES_KEY, [context.getHandler(), context.getClass()]);
  });
});
