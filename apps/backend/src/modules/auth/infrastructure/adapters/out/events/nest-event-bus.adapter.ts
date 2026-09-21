import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventBusPort } from '../../../../application/ports/out/event-bus.port';

@Injectable()
export class NestEventBusAdapter extends EventBusPort {
  constructor(private readonly emitter: EventEmitter2) {
    super();
  }

  publish(eventName: string, payload: unknown): void {
    this.emitter.emit(eventName, payload);
  }
}
