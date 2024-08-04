import type { AnySignal } from '../types';

import { Signal } from 'signal-polyfill';

export const scan = <I, O>(source: AnySignal<I>, scanFn: (acc: O, data: I) => O, initial: O) => {
  let acc: O;
  return new Signal.Computed<O>(() => {
    const newData = source.get();
    acc = scanFn(acc ?? initial, newData);
    return acc;
  });
};
