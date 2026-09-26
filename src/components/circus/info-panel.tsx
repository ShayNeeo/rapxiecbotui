'use client'

import { X, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { Hotspot } from '@/lib/circus-data'

export function InfoPanel({
  hotspot,
  onClose,
}: {
  hotspot: Hotspot | null
  onClose: () => void
}) {
  if (!hotspot) return null

  return (
    <aside
      className="pointer-events-auto absolute inset-x-0 bottom-0 z-30 max-h-[75vh] overflow-y-auto rounded-t-2xl border-t border-border bg-card/95 shadow-2xl backdrop-blur-md md:inset-y-0 md:right-0 md:left-auto md:h-full md:max-h-none md:w-[400px] md:rounded-none md:rounded-l-2xl md:border-l md:border-t-0"
      aria-label={`Thông tin: ${hotspot.title}`}
    >
      {hotspot.image ? (
        <div className="relative">
          <img
            src={hotspot.image}
            alt={hotspot.imageAlt || hotspot.title}
            className="h-44 w-full object-cover md:h-52"
            crossOrigin="anonymous"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-card/95 to-transparent" />
          <Button
            size="icon"
            variant="secondary"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full cursor-pointer"
            aria-label="Đóng bảng thông tin"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="absolute bottom-3 left-4 right-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-500">
              {hotspot.subtitle}
            </p>
            <h2 className="text-pretty text-2xl font-bold text-foreground">
              {hotspot.title}
            </h2>
          </div>
        </div>
      ) : (
        <div className="relative border-b border-border/70 bg-gradient-to-b from-card to-card/60 p-5 pt-6">
          <Button
            size="icon"
            variant="secondary"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full cursor-pointer"
            aria-label="Đóng bảng thông tin"
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="pr-10">
            <p className="text-xs font-semibold uppercase tracking-wider text-amber-500">
              {hotspot.subtitle}
            </p>
            <h2 className="text-pretty text-2xl font-bold text-foreground mt-1">
              {hotspot.title}
            </h2>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-5 p-5">
        <p className="text-pretty leading-relaxed text-muted-foreground" style={{ fontSize: '14px' }}>
          {hotspot.description}
        </p>

        <div className="flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-foreground">Có thể bạn chưa biết</h3>
          <ul className="flex flex-col gap-2" style={{ fontSize: '14px' }}>
            {hotspot.facts.map((fact, i) => (
              <li key={i} className="flex gap-2 text-muted-foreground">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                <span className="leading-relaxed">{fact}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </aside>
  )
}
