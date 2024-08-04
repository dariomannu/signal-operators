import type { AnySignal } from '../types';

import { Signal } from 'signal-polyfill';

export const combineLatest = (...sources: AnySignal<unknown>[]) =>
  new Signal.Computed(() => sources.map(s=>s.get()))
;
