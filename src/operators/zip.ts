import { Signal } from 'signal-polyfill';
import { effect } from '../utils/effect'

import { BehaviorSubject, zip as rxzip } from 'rxjs'

type AnySignal<T> = Signal.State<T> | Signal.Computed<T>;

export const zip2 = (...sources: (Signal.State<unknown> | Signal.Computed<unknown>)[]) => {
  const streams = sources.map(source => new BehaviorSubject(source.get()));
  sources.forEach((source, index) => effect(() => streams[index].next(source.get())));
  return rxzip(...streams);
};

/**
 * A "lossy" version of zip, that takes the latest distinct value
 * from each source stream and emits an array with each
 */
export const zip = (...sources: AnySignal<unknown>[]) => {
  let state;
  
  const reset = () => state = [...new Array(sources.length)].map(() => Promise.withResolvers());
  reset();

  const s = sources.map((s, i)=>
    new Signal.Computed(() => {
      state[i].resolve(s.get());
    })
  )

  const output = new Signal.State(undefined);

  const emit = data => {
    output.set(data);
    reset();
    restart();
  }

  const restart = () => Promise.all(state.map(s=>s.promise)).then(emit);
  restart();
  return output;
};
