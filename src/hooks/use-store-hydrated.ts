"use client";

import { useEffect, useState } from "react";
import { useGameStore } from "@/stores/game";

export function useStoreHydrated(): boolean {
  const [hydrated, setHydrated] = useState(() => useGameStore.persist.hasHydrated());

  useEffect(() => {
    if (hydrated) return;
    const unsub = useGameStore.persist.onFinishHydration(() => setHydrated(true));
    setHydrated(useGameStore.persist.hasHydrated());
    return unsub;
  }, [hydrated]);

  return hydrated;
}
