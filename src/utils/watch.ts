import { Signal } from "signal-polyfill";
import { AnySignal } from "../types";

export const watch = <T>(source: AnySignal<T>, callback: (unwatch: () => void) => void) => {
  let needsEnqueue = true;

  const w = new Signal.subtle.Watcher(() => {
    if (needsEnqueue) {
      needsEnqueue = false;
      queueMicrotask(processPending);
    }
  });
  
  function processPending() {
    needsEnqueue = true;

    for (const s of w.getPending()) {
      s.get();
    }
    w.watch();
  }

  const unwatch = () => w.unwatch();

  const computed = new Signal.Computed(() => {
    debugger;
    callback(unwatch);
    w.watch(source);

  });
  
  w.watch(source);
  computed.get();
  
  return computed;
};
