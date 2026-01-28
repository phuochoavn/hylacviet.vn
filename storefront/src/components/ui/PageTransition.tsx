"use client"

import { motion, AnimatePresence, useReducedMotion } from "framer-motion"
import { usePathname } from "next/navigation"
import { ReactNode, useEffect, useState, createContext, useContext } from "react"

// Context for shared element transitions
interface TransitionContextType {
  sharedElementId: string | null
  setSharedElementId: (id: string | null) => void
  transitionImage: string | null
  setTransitionImage: (src: string | null) => void
}

const TransitionContext = createContext<TransitionContextType>({
  sharedElementId: null,
  setSharedElementId: () => {},
  transitionImage: null,
  setTransitionImage: () => {},
})

export const usePageTransition = () => useContext(TransitionContext)

interface PageTransitionProps {
  children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
  const pathname = usePathname()
  const [isAnimating, setIsAnimating] = useState(false)
  const [sharedElementId, setSharedElementId] = useState<string | null>(null)
  const [transitionImage, setTransitionImage] = useState<string | null>(null)
  const prefersReducedMotion = useReducedMotion()

  useEffect(() => {
    // Skip animation on reduced motion preference
    if (prefersReducedMotion) return

    setIsAnimating(true)
    const timer = setTimeout(() => {
      setIsAnimating(false)
      setTransitionImage(null)
      setSharedElementId(null)
    }, 1000)
    return () => clearTimeout(timer)
  }, [pathname, prefersReducedMotion])

  // Skip animation effects if user prefers reduced motion
  if (prefersReducedMotion) {
    return (
      <TransitionContext.Provider
        value={{ sharedElementId, setSharedElementId, transitionImage, setTransitionImage }}
      >
        {children}
      </TransitionContext.Provider>
    )
  }

  return (
    <TransitionContext.Provider
      value={{ sharedElementId, setSharedElementId, transitionImage, setTransitionImage }}
    >
      {/* Cinematic page transition overlay */}
      <AnimatePresence mode="wait">
        {isAnimating && (
          <motion.div
            key="page-transition"
            className="fixed inset-0 z-[100] pointer-events-none overflow-hidden"
          >
            {/* Grain texture overlay */}
            <motion.div
              className="absolute inset-0 opacity-[0.05] mix-blend-overlay"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.05, 0.05, 0] }}
              transition={{ duration: 1, times: [0, 0.3, 0.7, 1] }}
            />

            {/* Multiple vertical slices for curtain effect */}
            {[...Array(5)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute top-0 bottom-0 bg-ink"
                style={{
                  left: `${i * 20}%`,
                  width: "20.5%", // Slight overlap to prevent gaps
                }}
                initial={{ scaleY: 0 }}
                animate={{ scaleY: [0, 1, 1, 0] }}
                transition={{
                  duration: 0.9,
                  times: [0, 0.4, 0.6, 1],
                  ease: [0.76, 0, 0.24, 1],
                  delay: i * 0.03,
                }}
                style={{
                  left: `${i * 20}%`,
                  width: "20.5%",
                  originY: i % 2 === 0 ? 0 : 1, // Alternate origin for visual interest
                }}
              />
            ))}

            {/* Gold accent line */}
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-silk-gold top-1/2 -translate-y-1/2"
              initial={{ scaleX: 0, opacity: 0 }}
              animate={{
                scaleX: [0, 1, 1, 0],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 0.9,
                times: [0, 0.3, 0.7, 1],
                ease: [0.76, 0, 0.24, 1],
              }}
            />

            {/* Brand logo in center */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{
                opacity: [0, 1, 1, 0],
                scale: [0.9, 1, 1, 1.1],
              }}
              transition={{
                duration: 0.9,
                times: [0, 0.35, 0.65, 1],
                ease: [0.215, 0.61, 0.355, 1],
              }}
            >
              <div className="text-center">
                <motion.span
                  className="block font-display text-5xl md:text-6xl text-paper tracking-[0.15em]"
                  initial={{ y: 20 }}
                  animate={{ y: [20, 0, 0, -20] }}
                  transition={{ duration: 0.9, times: [0, 0.35, 0.65, 1] }}
                >
                  MAI ĐỎ
                </motion.span>
                <motion.span
                  className="block font-sans text-xs tracking-[0.4em] uppercase text-paper/50 mt-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.5, 0.5, 0] }}
                  transition={{ duration: 0.9, times: [0, 0.4, 0.6, 1] }}
                >
                  Áo Dài Việt Nam
                </motion.span>
              </div>
            </motion.div>

            {/* Shared element image transition */}
            {transitionImage && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: [0, 1, 1, 0],
                  scale: [0.8, 1, 1.2, 1.5],
                }}
                transition={{
                  duration: 1,
                  times: [0, 0.3, 0.7, 1],
                  ease: [0.215, 0.61, 0.355, 1],
                }}
              >
                <div
                  className="w-64 h-80 bg-cover bg-center rounded-sm shadow-2xl"
                  style={{ backgroundImage: `url(${transitionImage})` }}
                />
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main content with fade and slide */}
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{
          duration: 0.5,
          delay: 0.4,
          ease: [0.215, 0.61, 0.355, 1],
        }}
      >
        {children}
      </motion.div>
    </TransitionContext.Provider>
  )
}

// =====================================================
// SHARED ELEMENT - Wrap elements for transition
// =====================================================
interface SharedElementProps {
  children: ReactNode
  id: string
  imageSrc?: string
  className?: string
}

export function SharedElement({ children, id, imageSrc, className }: SharedElementProps) {
  const { setSharedElementId, setTransitionImage } = usePageTransition()

  const handleClick = () => {
    setSharedElementId(id)
    if (imageSrc) {
      setTransitionImage(imageSrc)
    }
  }

  return (
    <div onClick={handleClick} className={className} data-shared-element={id}>
      {children}
    </div>
  )
}

// =====================================================
// PAGE REVEAL - Entry animation for page sections
// =====================================================
interface PageRevealProps {
  children: ReactNode
  delay?: number
}

export function PageReveal({ children, delay = 0 }: PageRevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.8,
        delay: 0.5 + delay,
        ease: [0.215, 0.61, 0.355, 1],
      }}
    >
      {children}
    </motion.div>
  )
}
