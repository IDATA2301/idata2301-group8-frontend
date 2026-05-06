import { useRef, type RefObject } from "react";
import type { DefaultToastOptions, Renderable, ValueOrFunction } from "react-hot-toast";
import originalToast, { Toaster as OriginalToaster } from "react-hot-toast";

let popoverRef: RefObject<HTMLDivElement | null>

function safeShowPopover() {
  // Force the popover to re-render to ensure the toast is visible
  popoverRef.current?.hidePopover();
  popoverRef.current?.showPopover();
}

const toast = {
  promise<T>(promise: Promise<T> | (() => Promise<T>), msgs: {
    loading: Renderable;
    success?: ValueOrFunction<Renderable, T> | undefined;
    error?: ValueOrFunction<Renderable, any> | undefined;
  }, opts?: DefaultToastOptions): Promise<T> {
    safeShowPopover()
    return originalToast.promise(promise, msgs, opts);
  },
  error(msg: Renderable, opts?: DefaultToastOptions) {
    safeShowPopover()
    return originalToast.error(msg, opts);
  }
};

export default toast;

export function Toaster() {
  popoverRef = useRef<HTMLDivElement>(null);

  return (
    <div popover="manual" ref={popoverRef}>
      <OriginalToaster />
    </div>
  );
}
