'use client'

import { Suspense, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Canvas } from '@react-three/fiber'
import { Loader } from '@react-three/drei'
import {
  RotateCcw,
  MousePointer2,
  Ticket,
  ArrowLeft,
  MessageSquareText,
} from 'lucide-react'
import { Scene } from './scene'
import { InfoPanel } from './info-panel'
import { HOTSPOTS, DEFAULT_CAMERA } from '@/lib/circus-data'
import { Button } from '@/components/ui/button'

export function CircusExperience() {
  const [activeId, setActiveId] = useState<string | null>(null)
  const [intro, setIntro] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const activeHotspot = HOTSPOTS.find((h) => h.id === activeId) ?? null

  return (
    <main className="circus-3d-root relative h-screen w-full overflow-hidden bg-background">
      <Canvas
        shadows
        dpr={[1, 1.75]}
        gl={{ toneMappingExposure: 1.05 }}
        camera={{ position: DEFAULT_CAMERA.position, fov: 55, near: 0.1, far: 200 }}
      >
        <Suspense fallback={null}>
          <Scene activeId={activeId} onSelect={setActiveId} />
        </Suspense>
      </Canvas>
      <Loader
        containerStyles={{ background: '#160b09' }}
        barStyles={{ background: '#e8b93a' }}
        dataStyles={{ color: '#f4ead3', fontFamily: 'var(--font-sans)' }}
        dataInterpolation={(p) => `Đang dựng rạp xiếc… ${p.toFixed(0)}%`}
      />

      {/* Top bar with Navigation */}
      <header className="pointer-events-none absolute inset-x-0 top-0 z-20 flex items-center justify-between gap-3 p-4 md:p-6">
        <div className="pointer-events-auto flex items-center gap-2">
          <Link
            to="/"
            className="flex items-center gap-2 rounded-xl border border-border bg-card/85 px-3 py-2 text-xs font-semibold text-foreground backdrop-blur-md transition-all hover:bg-accent hover:text-accent-foreground shadow-md cursor-pointer"
            title="Về Sân Khấu Chính"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="hidden sm:inline">Về Sân Khấu Chính</span>
            <span className="sm:hidden">Trang chủ</span>
          </Link>

          <Link
            to="/chatbot"
            className="flex items-center gap-2 rounded-xl border border-border bg-card/85 px-3 py-2 text-xs font-semibold text-foreground backdrop-blur-md transition-all hover:bg-accent hover:text-accent-foreground shadow-md cursor-pointer"
            title="Trò chuyện cùng Chatbot AI"
          >
            <MessageSquareText className="h-4 w-4 text-accent" />
            <span className="hidden sm:inline">Chatbot AI</span>
          </Link>
        </div>

        {/* Center Title Badge */}
        <div className="pointer-events-auto hidden md:flex items-center gap-3 rounded-xl border border-border bg-card/80 px-4 py-2.5 backdrop-blur-md">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-xs">
            <Ticket className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-sm font-bold leading-tight text-foreground md:text-base">
              Rạp Xiếc Bỏ Túi 3D
            </h1>
            <p className="text-xs text-muted-foreground">Không gian bảo tàng xiếc số tương tác 360°</p>
          </div>
        </div>

        {/* Right View Controls */}
        <div className="pointer-events-auto flex gap-2">
          {activeId && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setActiveId(null)}
              aria-label="Trở về toàn cảnh"
              className="backdrop-blur-md border border-border bg-card/85 text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer px-3"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline text-xs font-medium ml-1">Toàn cảnh</span>
            </Button>
          )}
        </div>
      </header>

      {/* Hotspot quick-nav (bottom, hidden when panel open on mobile) */}
      {!activeId && (
        <nav className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex flex-col items-center gap-3 p-4 md:p-6">
          <div className="pointer-events-auto flex items-center gap-2 rounded-full border border-border bg-card/80 px-3 py-1.5 text-xs text-muted-foreground backdrop-blur-md">
            <MousePointer2 className="h-3.5 w-3.5" />
            Kéo để xoay · cuộn để phóng to · nhấn điểm{' '}
            <span className="inline-flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] text-primary-foreground">
              +
            </span>{' '}
            để khám phá
          </div>
          <div className="pointer-events-auto flex max-w-full flex-wrap justify-center gap-2">
            {HOTSPOTS.map((h) => (
              <button
                key={h.id}
                onClick={() => setActiveId(h.id)}
                className="rounded-full border border-border bg-card/70 px-3 py-1.5 text-xs font-medium text-foreground backdrop-blur-md transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                {h.title}
              </button>
            ))}
          </div>
        </nav>
      )}

      <InfoPanel hotspot={activeHotspot} onClose={() => setActiveId(null)} />

      {/* Intro overlay */}
      {mounted && intro && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-background/70 p-6 backdrop-blur-sm">
          <div className="max-w-md rounded-2xl border border-border bg-card p-6 text-center shadow-2xl md:p-8">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Ticket className="h-7 w-7" />
            </span>
            <h2 className="text-balance text-2xl font-bold text-foreground">
              Chào mừng đến Rạp Xiếc Bỏ Túi
            </h2>
            <p className="mt-3 text-pretty leading-relaxed text-muted-foreground">
              Bước vào không gian rạp xiếc 3D tương tác. Xoay 360°, phóng to
              từng góc và nhấn vào các điểm{' '}
              <span className="font-semibold text-accent">+</span> để khám phá
              sân khấu, nghệ sĩ, ánh sáng và trò chuyện cùng hướng dẫn viên AI.
            </p>
            <div className="mt-6 flex justify-center">
              <Button
                onClick={() => setIntro(false)}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 cursor-pointer"
              >
                Bắt đầu khám phá
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
