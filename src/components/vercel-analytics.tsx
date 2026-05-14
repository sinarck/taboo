"use client"

import { useEffect } from "react"

export function VercelAnalytics() {
  useEffect(() => {
    let cancelled = false
    import("@vercel/analytics").then(({ inject }) => {
      if (!cancelled) inject()
    })
    return () => {
      cancelled = true
    }
  }, [])
  return null
}
