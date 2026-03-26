"use client"

import { MapPin, Navigation, ZoomIn, ZoomOut, Layers } from "lucide-react"
import { Button } from "@/components/ui/button"

interface MapContainerProps {
  className?: string
  showControls?: boolean
  markers?: Array<{
    id: string
    type: "blank" | "competitor"
    name: string
    lat: number
    lng: number
  }>
  onMarkerClick?: (id: string) => void
  selectedMarkerId?: string
}

export function MapContainer({ 
  className = "", 
  showControls = true,
  markers = [],
  onMarkerClick,
  selectedMarkerId
}: MapContainerProps) {
  return (
    <div className={`relative h-full w-full overflow-hidden rounded-lg border border-border/50 bg-muted/20 ${className}`}>
      {/* Map placeholder with grid pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent">
        <svg className="h-full w-full opacity-30" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-border"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Simulated map content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            <MapPin className="h-8 w-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground">高德地图加载区域</p>
          <p className="mt-1 text-xs text-muted-foreground">请配置高德地图 API Key</p>
        </div>
      </div>

      {/* Sample markers visualization */}
      {markers.length > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {markers.map((marker, index) => {
            const isSelected = marker.id === selectedMarkerId
            const left = 20 + (index % 5) * 15
            const top = 20 + Math.floor(index / 5) * 20
            
            return (
              <div
                key={marker.id}
                className={`absolute cursor-pointer pointer-events-auto transition-transform ${isSelected ? 'scale-125 z-10' : 'hover:scale-110'}`}
                style={{ left: `${left}%`, top: `${top}%` }}
                onClick={() => onMarkerClick?.(marker.id)}
              >
                {marker.type === "blank" ? (
                  <div className="relative">
                    <div className={`h-4 w-4 rounded-full ${isSelected ? 'bg-accent' : 'bg-red-500'} shadow-lg`}>
                      <div className="absolute inset-0 animate-ping rounded-full bg-red-500/50" />
                    </div>
                  </div>
                ) : (
                  <div className={`h-3 w-3 rounded-full ${isSelected ? 'bg-accent' : 'bg-green-500'} shadow-lg`} />
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Map Controls */}
      {showControls && (
        <div className="absolute right-4 top-4 flex flex-col gap-2">
          <Button variant="secondary" size="icon" className="h-9 w-9 bg-card shadow-md">
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" className="h-9 w-9 bg-card shadow-md">
            <ZoomOut className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" className="h-9 w-9 bg-card shadow-md">
            <Layers className="h-4 w-4" />
          </Button>
          <Button variant="secondary" size="icon" className="h-9 w-9 bg-card shadow-md">
            <Navigation className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Legend */}
      <div className="absolute bottom-4 left-4 rounded-lg bg-card/95 p-3 shadow-md backdrop-blur-sm">
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
    </div>
  )
}
