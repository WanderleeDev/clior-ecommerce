import { EventEmitter2 } from '@nestjs/event-emitter';
import { NestEventBusAdapter } from './nest-event-bus.adapter';

// @nestjs/event-emitter ships untranspiled ESM and jest.config.js may not be
// touched, so the module is stubbed; the adapter only needs its type plus the
// emitter instance passed in by hand in these tests.
jest.mock('@nestjs/event-emitter', () => ({
  EventEmitter2: class EventEmitter2 {},
}));

/**
 * The fake mirrors the two dispatch paths of eventemitter2:
 * - `emit` invokes listeners synchronously and ignores the promises they return;
 * - `emitAsync` collects listener results and returns `Promise.all(...)`.
 */
describe('NestEventBusAdapter', () => {
  let emitter: { emit: jest.Mock; emitAsync: jest.Mock };
  let adapter: NestEventBusAdapter;
  let loggerError: jest.SpyInstance;

  beforeEach(() => {
    emitter = {
      emit: jest.fn().mockReturnValue(true),
      emitAsync: jest.fn().mockResolvedValue([true]),
    };
    adapter = new NestEventBusAdapter(emitter as unknown as EventEmitter2);
    loggerError = jest
      .spyOn(
        (adapter as unknown as { logger: { error: (...args: unknown[]) => void } }).logger,
        'error',
      )
      .mockImplementation(() => undefined);
  });

  afterEach(() => {
    loggerError.mockRestore();
  });

  it('dispatches events through the awaitable emitter path', async () => {
    adapter.publish('auth.test', { id: 'user-1' });
    await new Promise((resolve) => setImmediate(resolve));

    expect(emitter.emitAsync).toHaveBeenCalledWith('auth.test', { id: 'user-1' });
    expect(loggerError).not.toHaveBeenCalled();
  });

  it('contains and logs dispatch rejections instead of dropping them', async () => {
    emitter.emitAsync.mockRejectedValue(new Error('listener blew up'));

    expect(() => adapter.publish('auth.test', {})).not.toThrow();
    await new Promise((resolve) => setImmediate(resolve));

    expect(loggerError).toHaveBeenCalledWith(
      expect.stringContaining('auth.test'),
      expect.anything(),
    );
  });

  it('never lets synchronous emitter failures escape publish', async () => {
    emitter.emit.mockImplementation(() => {
      throw new Error('emitter exploded');
    });
    emitter.emitAsync.mockImplementation(() => {
      throw new Error('emitter exploded');
    });

    expect(() => adapter.publish('auth.test', {})).not.toThrow();
    await new Promise((resolve) => setImmediate(resolve));

    expect(loggerError).toHaveBeenCalledWith(
      expect.stringContaining('auth.test'),
      expect.anything(),
    );
  });
});
