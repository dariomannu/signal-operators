import type { AnySignal } from '../types';

import { Signal } from 'signal-polyfill';
import { effect } from '../utils/effect'

export const takeWhile = <T>(source: AnySignal<T>, filterFn: (data: T) => boolean) => {
  let end = false;
  const output = new Signal.State(source.get());
  effect(() => {
    const value = source.get();
    if(end) {
      return;
    }

    if(filterFn(value)) {
      output.set(value)
    } else {
      end = true;
    }
  })
  
  return output;
};
