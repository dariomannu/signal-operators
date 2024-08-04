import type { AnySignal } from '../types';

import { Signal } from 'signal-polyfill';
import { effect } from '../utils/effect';
import { Observe } from '../utils/observer';

export const takeUntil = (source: AnySignal<unknown>, event: AnySignal<unknown>) => {
  let end = false;
  
  const output = new Signal.State(source.get());
  Observe(event).subscribe(()=>end=true);

  effect(() => {
    event.get() || output.set(source.get())
  })
  
  return output;
};


export const takeUntil2 = (source: AnySignal<unknown>, event: AnySignal<unknown>) => {
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

  const isOver = new Signal.Computed(() => {
    finished = true;
    w.unwatch();
  });

  const current = new Signal.State(source);

  effect(() => {
    current.set(source.get())
  });

  const computed = new Signal.Computed(() => {
    const value = source.get();
    stream.next(value);
  });

  w.watch(source, isOver);
  computed.get();
  return stream;
};
