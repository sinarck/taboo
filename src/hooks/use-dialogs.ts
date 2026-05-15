"use client";

import { useCallback, useState } from "react";

export type DialogName = "settings" | "help" | "reset";

export type DialogsApi = {
  current: DialogName | null;
  isOpen: (name: DialogName) => boolean;
  open: (name: DialogName) => void;
  close: () => void;
  toggle: (name: DialogName) => (open: boolean) => void;
};

export function useDialogs(): DialogsApi {
  const [current, setCurrent] = useState<DialogName | null>(null);

  const open = useCallback((name: DialogName) => setCurrent(name), []);
  const close = useCallback(() => setCurrent(null), []);
  const toggle = useCallback(
    (name: DialogName) => (next: boolean) => setCurrent(next ? name : null),
    [],
  );
  const isOpen = useCallback((name: DialogName) => current === name, [current]);

  return { current, isOpen, open, close, toggle };
}
