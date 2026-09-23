'use client'

import { Html } from '@react-three/drei'
import { HOTSPOTS } from '@/lib/circus-data'
import { Plus } from 'lucide-react'

export function Hotspots({
  activeId,
  onSelect,
}: {
  activeId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <group>
      {HOTSPOTS.map((h) => {
        const active = activeId === h.id
        return (
          <Html
            key={h.id}
            position={h.position}
            center
            distanceFactor={16}
            zIndexRange={[20, 0]}
          >
            <button
              onClick={(e) => {
                e.stopPropagation()
                onSelect(h.id)
              }}
              className="group relative flex items-center justify-center"
              aria-label={`Xem thông tin: ${h.title}`}
            >
              <span
                className={`absolute inline-flex h-9 w-9 rounded-full ${
                  active ? 'bg-accent/60' : 'bg-accent/40'
                } animate-ping`}
              />
              <span
                className={`relative inline-flex h-9 w-9 items-center justify-center rounded-full border-2 shadow-lg transition-transform duration-200 group-hover:scale-110 ${
                  active
                    ? 'border-accent bg-accent text-accent-foreground'
                    : 'border-accent/80 bg-primary text-primary-foreground'
                }`}
              >
                <Plus className="h-5 w-5" strokeWidth={2.5} />
              </span>
              <span className="pointer-events-none absolute left-1/2 top-11 -translate-x-1/2 whitespace-nowrap rounded-md bg-popover/90 px-2 py-1 text-xs font-medium text-popover-foreground opacity-0 shadow-md backdrop-blur transition-opacity duration-200 group-hover:opacity-100">
                {h.title}
              </span>
            </button>
          </Html>
        )
      })}
    </group>
  )
}
