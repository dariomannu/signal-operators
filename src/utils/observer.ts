import type { AnySignal } from '../types'

import { Signal } from 'signal-polyfill';
import type { Observable, Subscriber } from 'rxjs';
import { BehaviorSubject, finalize } from 'rxjs';

/**
 * Create an Observable from a Signal
 */
export const Observe = <T>(source: AnySignal<T>) => {
  let pending = false;

  const w = new Signal.subtle.Watcher(() => {
      if(!pending) {
          pending = true;
          queueMicrotask(processPending);
      }
  });

  function processPending() {
      pending = false;
      for (const s of w.getPending()) {
        s.get();
      }
      w.watch();
  }

  const stream = <Observable<T> & Subscriber<T>>new BehaviorSubject<T>(source.get()).pipe(
    finalize(() => w.unwatch())
  );
  
  const computed = new Signal.Computed(() => {
    const value = source.get();
    stream.next(value);
  });

  w.watch(computed);
  computed.get();
  return stream;
};
