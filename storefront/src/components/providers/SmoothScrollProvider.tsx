'use client'

import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from 'react'
import Lenis from 'lenis'

interface LenisContextType {
  lenis: Lenis | null
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => void
  stop: () => void
  start: () => void
}

const LenisContext = createContext<LenisContextType>({
  lenis: null,
  scrollTo: () => {},
  stop: () => {},
  start: () => {},
})

export const useLenis = () => useContext(LenisContext)

interface SmoothScrollProviderProps {
  children: ReactNode
  options?: {
    duration?: number
    smoothWheel?: boolean
    wheelMultiplier?: number
    touchMultiplier?: number
    infinite?: boolean
  }
}

export default function SmoothScrollProvider({
  children,
  options = {}
}: SmoothScrollProviderProps) {
  const lenisRef = useRef<Lenis | null>(null)
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    // Initialize Lenis with premium scroll feel
    lenisRef.current = new Lenis({
      duration: options.duration ?? 1.4,
      easing: (t) => {
        // Custom easing: smooth out-expo for luxury feel
        return t === 1 ? 1 : 1 - Math.pow(2, -10 * t)
      },
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: options.smoothWheel ?? true,
      wheelMultiplier: options.wheelMultiplier ?? 0.8, // Slower for elegance
      touchMultiplier: options.touchMultiplier ?? 1.5,
      infinite: options.infinite ?? false,
    })

    setLenis(lenisRef.current)

    // RAF loop for smooth updates
    function raf(time: number) {
      lenisRef.current?.raf(time)
      rafRef.current = requestAnimationFrame(raf)
    }

    rafRef.current = requestAnimationFrame(raf)

    // Cleanup
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
      lenisRef.current?.destroy()
    }
  }, [options.duration, options.smoothWheel, options.wheelMultiplier, options.touchMultiplier, options.infinite])

  // Scroll to target with smooth animation
  const scrollTo = useCallback((
    target: string | number | HTMLElement,
    opts?: { offset?: number; duration?: number }
  ) => {
    lenisRef.current?.scrollTo(target, {
      offset: opts?.offset ?? 0,
      duration: opts?.duration ?? 1.5,
    })
  }, [])

  // Stop scrolling
  const stop = useCallback(() => {
    lenisRef.current?.stop()
  }, [])

  // Start scrolling
  const start = useCallback(() => {
    lenisRef.current?.start()
  }, [])

  return (
    <LenisContext.Provider value={{ lenis, scrollTo, stop, start }}>
      {children}
    </LenisContext.Provider>
  )
}

// Hook to subscribe to scroll events
export function useScrollProgress(callback: (progress: number) => void) {
  const { lenis } = useLenis()

  useEffect(() => {
    if (!lenis) return

    const handleScroll = ({ scroll, limit }: { scroll: number; limit: number }) => {
      const progress = scroll / limit
      callback(progress)
    }

    lenis.on('scroll', handleScroll)

    return () => {
      lenis.off('scroll', handleScroll)
    }
  }, [lenis, callback])
}
