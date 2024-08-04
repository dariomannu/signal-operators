import type { AnySignal } from '../types';

import { Signal } from 'signal-polyfill';
import { effect } from '../utils/effect'

export const filter = <T>(source: AnySignal<T>, filterFn: (data: T) => boolean) => {
  const initial = source.get();

  // FIXME: this is a nonsense situation. If the first value
  // from source doesn't pass the test, the state can't have a value.
  // Falling back to undefined, for now...
  const output = new Signal.State(filterFn(initial) ? initial : undefined);

  effect(() => {
    const value = source.get();
    filterFn(value) && output.set(value)
  })
  
  return output;
};
