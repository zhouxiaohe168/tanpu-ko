"use client"

import { useEffect, useState } from "react"

declare global {
  interface Window {
    AMap: any
    _amapLoadedKey: string
    _amapLoadCallbacks: Array<() => void>
  }
}

const AMAP_KEY = "03aa0dc32408d2b234f5e2bd4af013ff"

export function useAMap() {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    // Already loaded with the same key
    if (window._amapLoadedKey === AMAP_KEY && window.AMap) {
      setLoaded(true)
      return
    }

    // If a different key was loaded before, remove the old script
    if (window._amapLoadedKey && window._amapLoadedKey !== AMAP_KEY) {
      const oldScript = document.querySelector(
        `script[src*="webapi.amap.com"]`
      )
      if (oldScript) oldScript.remove()
      delete (window as any).AMap
      delete (window as any)._amapLoadedKey
      delete (window as any)._amapLoadCallbacks
    }

    // Already loading with same key - queue callback
    if (window._amapLoadCallbacks) {
      window._amapLoadCallbacks.push(() => setLoaded(true))
      return
    }

    // Start loading
    window._amapLoadCallbacks = [() => setLoaded(true)]

    const script = document.createElement("script")
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${AMAP_KEY}`
    script.async = true
    script.onload = () => {
      window._amapLoadedKey = AMAP_KEY
      window._amapLoadCallbacks?.forEach((cb) => cb())
      window._amapLoadCallbacks = []
    }
    script.onerror = () => {
      setError("高德地图加载失败，请检查 API Key 是否正确")
      window._amapLoadCallbacks = []
    }
    document.head.appendChild(script)
  }, [])

  return { loaded, error }
}
