import type { AnySignal } from '../types';

import { Signal } from 'signal-polyfill';
import { effect } from '../utils/effect'

type milliseconds = number;

export const delay = <T>(source: AnySignal<T>, time: milliseconds) => {
  const output = new Signal.State(undefined);

  effect(() => {
    const value = source.get();
    setTimeout(() => output.set(value), time);
  });

  return output;
};
