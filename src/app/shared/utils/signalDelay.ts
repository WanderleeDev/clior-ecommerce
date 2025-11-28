import { Signal } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime } from 'rxjs/operators';

export function debounceSignal<T>(signal: Signal<T>, time = 300) {
  return toSignal(toObservable(signal).pipe(debounceTime(time)));
}
