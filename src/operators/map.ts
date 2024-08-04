import type { AnySignal } from '../types';

import { Signal } from 'signal-polyfill';

export const map = <I, O>(source: AnySignal<I>, operatorFn: (data: I) => O) =>
  new Signal.Computed<O>(() =>
    operatorFn(source.get())
  )
;
