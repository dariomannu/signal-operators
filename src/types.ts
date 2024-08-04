import type { Signal } from 'signal-polyfill';

export type AnySignal<T> =
  | Signal.State<T>
  | Signal.Computed<T>
;