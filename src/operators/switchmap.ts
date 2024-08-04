import type { AnySignal } from '../types';

import { Signal } from 'signal-polyfill';
import { effect } from '../utils/effect'

export const switchMap = <I, O>(source: AnySignal<I>, switchFn: (data: I) => Signal.Computed<O>) => {
  let current: I;
  const next = () => switchFn(source.get());
  const output = new Signal.State(next());

  effect(() => {
    const newValue = source.get();
    if(newValue != current) {
      current = newValue;
      output.set(next());
    }
  })

  return output;
};
