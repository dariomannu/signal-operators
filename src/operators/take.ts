import type { AnySignal } from '../types';

import { Signal } from 'signal-polyfill';
// import { watch } from '../utils/watch';
import { effect } from '../utils/effect';

const INCLUDE_INITIAL: number = 1;

/**
 * Take the first N values from the source, plus the initial one.
 * take(source, 5) will emit (0 the initial), then 1st, 2nd, 3rd, 4th, 5th
 */
export const take = <T>(source: AnySignal<T>, limit: number) => {
  let count = 0 -INCLUDE_INITIAL;

  const output = new Signal.State(source.get());


  const cleanup = effect(() => {
    if(count++ >= limit) {
      cleanup();
    } else {
      const v = source.get();
      output.set(v);
    }
  });
  
  return output;
};
