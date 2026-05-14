"use client"

import { useEffect, useMemo } from "react"
import { useTimer } from "react-timer-hook"

type Options = {
  endAt: number | null
  pausedMs: number | null
  fallbackSeconds: number
  onExpire: () => void
}

export function useGameTimer({
  endAt,
  pausedMs,
  fallbackSeconds,
  onExpire,
}: Options): number {
  const expiry = useMemo(
    () => new Date(endAt ?? Date.now() + fallbackSeconds * 1000),
    [endAt, fallbackSeconds],
  )

  const { totalSeconds, restart, pause } = useTimer({
    expiryTimestamp: expiry,
    onExpire,
    autoStart: endAt !== null,
  })

  useEffect(() => {
    if (endAt !== null) {
      restart(new Date(endAt), true)
    } else {
      pause()
    }
  }, [endAt, pause, restart])

  if (endAt !== null) return totalSeconds
  if (pausedMs !== null) return Math.ceil(pausedMs / 1000)
  return fallbackSeconds
}
