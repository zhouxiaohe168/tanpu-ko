"use client"

import { useEffect, useState } from "react"

declare global {
  interface Window {
    AMap: any
    _amapLoaded: boolean
    _amapLoadCallbacks: Array<() => void>
  }
}

export function useAMap() {
  const [loaded, setLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (typeof window === "undefined") return

    // Already loaded
    if (window._amapLoaded && window.AMap) {
      setLoaded(true)
      return
    }

    // Already loading - queue callback
    if (window._amapLoadCallbacks) {
      window._amapLoadCallbacks.push(() => setLoaded(true))
      return
    }

    // Start loading
    window._amapLoadCallbacks = [() => setLoaded(true)]

    const key = process.env.NEXT_PUBLIC_AMAP_KEY
    if (!key) {
      setError("未配置高德地图 API Key（NEXT_PUBLIC_AMAP_KEY）")
      return
    }

    const script = document.createElement("script")
    script.src = `https://webapi.amap.com/maps?v=2.0&key=${key}`
    script.async = true
    script.onload = () => {
      window._amapLoaded = true
      window._amapLoadCallbacks?.forEach((cb) => cb())
      window._amapLoadCallbacks = []
    }
    script.onerror = () => {
      setError("高德地图加载失败，请检查 API Key 是否正确")
    }
    document.head.appendChild(script)
  }, [])

  return { loaded, error }
}
