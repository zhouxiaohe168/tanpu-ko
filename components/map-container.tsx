"use client"

import { useEffect, useRef } from "react"
import { useAMap } from "@/hooks/use-amap"
import { MapPin, AlertCircle, Loader2 } from "lucide-react"

interface Marker {
  id: string
  type: "blank" | "competitor"
  name: string
  lat: number
  lng: number
}

interface MapContainerProps {
  className?: string
  markers?: Marker[]
  onMarkerClick?: (id: string) => void
  selectedMarkerId?: string
  center?: { lat: number; lng: number }
}

export function MapContainer({
  className = "",
  markers = [],
  onMarkerClick,
  selectedMarkerId,
  center,
}: MapContainerProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const markerMapRef = useRef<Map<string, any>>(new Map())
  const infoWindowRef = useRef<any>(null)
  const { loaded, error } = useAMap()

  // 初始化地图
  useEffect(() => {
    if (!loaded || !mapRef.current || mapInstanceRef.current) return

    const AMap = window.AMap
    const defaultCenter = center
      ? [center.lng, center.lat]
      : [116.397428, 39.90923]

    mapInstanceRef.current = new AMap.Map(mapRef.current, {
      zoom: 13,
      center: defaultCenter,
      mapStyle: "amap://styles/light",
    })

    infoWindowRef.current = new AMap.InfoWindow({ offset: new AMap.Pixel(0, -20) })

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.destroy()
        mapInstanceRef.current = null
      }
    }
  }, [loaded])

  // 渲染标记点
  useEffect(() => {
    if (!loaded || !mapInstanceRef.current) return

    const AMap = window.AMap
    const map = mapInstanceRef.current

    // 清除旧标记
    markerMapRef.current.forEach((marker) => map.remove(marker))
    markerMapRef.current.clear()

    markers.forEach((item) => {
      const isSelected = item.id === selectedMarkerId
      const isBlank = item.type === "blank"
      const color = isBlank ? (isSelected ? "#F59E0B" : "#EF4444") : "#22C55E"
      const size = isBlank ? (isSelected ? 20 : 16) : 12

      const content = `
        <div style="position:relative;width:${size}px;height:${size}px;cursor:pointer;">
          <div style="
            width:${size}px;height:${size}px;
            border-radius:50%;
            background:${color};
            border:2px solid white;
            box-shadow:0 2px 8px rgba(0,0,0,0.3);
            position:relative;
            z-index:1;
          "></div>
          ${isBlank ? `<div style="
            position:absolute;top:0;left:0;
            width:${size}px;height:${size}px;
            border-radius:50%;
            background:${color};
            opacity:0.35;
            animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;
          "></div>` : ""}
        </div>
      `

      const marker = new AMap.Marker({
        position: [item.lng, item.lat],
        content,
        title: item.name,
        offset: new AMap.Pixel(-size / 2, -size / 2),
      })

      marker.on("click", () => {
        onMarkerClick?.(item.id)
      })

      marker.on("mouseover", () => {
        if (!infoWindowRef.current) return
        infoWindowRef.current.setContent(`
          <div style="padding:8px 12px;font-size:13px;font-family:sans-serif;color:#1e293b;max-width:200px;line-height:1.5;">
            <div style="font-weight:600;margin-bottom:2px;">${item.name}</div>
            <div style="color:${isBlank ? "#2563eb" : "#16a34a"};font-size:12px;">
              ${isBlank ? "空白点" : "竞品门店"}
            </div>
          </div>
        `)
        infoWindowRef.current.open(map, marker.getPosition())
      })

      marker.on("mouseout", () => {
        infoWindowRef.current?.close()
      })

      map.add(marker)
      markerMapRef.current.set(item.id, marker)
    })
  }, [loaded, markers, selectedMarkerId, onMarkerClick])

  // 选中时飞到对应位置
  useEffect(() => {
    if (!loaded || !mapInstanceRef.current || !selectedMarkerId) return
    const selected = markers.find((m) => m.id === selectedMarkerId)
    if (selected) {
      mapInstanceRef.current.panTo([selected.lng, selected.lat])
      mapInstanceRef.current.setZoom(15)
    }
  }, [loaded, selectedMarkerId, markers])

  // center 变化时平移地图
  useEffect(() => {
    if (!loaded || !mapInstanceRef.current || !center) return
    mapInstanceRef.current.panTo([center.lng, center.lat])
  }, [loaded, center])

  if (error) {
    return (
      <div className={`flex items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 ${className}`}>
        <div className="text-center px-6">
          <AlertCircle className="mx-auto mb-3 h-10 w-10 text-destructive/60" />
          <p className="text-sm font-medium text-destructive">地图加载失败</p>
          <p className="mt-1 text-xs text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden rounded-lg border border-border/50 ${className}`}>
      {/* 高德地图挂载点 */}
      <div ref={mapRef} className="h-full w-full" />

      {/* 加载中遮罩 */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/30 backdrop-blur-sm">
          <div className="text-center">
            <Loader2 className="mx-auto mb-3 h-8 w-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground">地图加载中...</p>
          </div>
        </div>
      )}

      {/* 图例 */}
      {loaded && markers.length > 0 && (
        <div className="absolute bottom-4 left-4 z-10 rounded-lg bg-card/95 px-3 py-2 shadow-md backdrop-blur-sm">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-muted-foreground">空白点</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-muted-foreground">竞品门店</span>
            </div>
          </div>
        </div>
      )}

      {/* 无标记时的提示 */}
      {loaded && markers.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <MapPin className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm text-muted-foreground">请输入查询条件开始探铺</p>
          </div>
        </div>
      )}
    </div>
  )
}
