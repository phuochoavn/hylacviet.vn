'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import dynamic from 'next/dynamic'

// Dynamic import for Three.js component (no SSR)
const SilkCanvas = dynamic(() => import('../three/SilkCanvas'), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 bg-gradient-to-b from-paper to-paper-warm" />
  ),
})

interface HeroSectionProps {
  brandName?: string
  slogan?: string
}

export default function HeroSection({ 
  brandName = "Mai Đo",
  slogan = "Di sản trong hơi thở mới"
}: HeroSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  
  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  // Transform values for scroll animations
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -100])
  
  // Initial load animation
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 100)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <section 
      ref={containerRef}
      className="relative h-[100vh] w-full overflow-hidden bg-paper"
    >
      {/* 3D Silk Background */}
      <motion.div 
        className="absolute inset-0"
        style={{ scale, opacity }}
      >
        <SilkCanvas />
      </motion.div>
      
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-paper/50 pointer-events-none" />
      
      {/* Content */}
      <motion.div 
        className="relative z-10 h-full flex flex-col items-center justify-center px-6"
        style={{ y }}
      >
        {/* Brand Name */}
        <motion.h1
          className="brand-text text-ink text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl"
          initial={{ opacity: 0, y: 30 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1.2, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {brandName}
        </motion.h1>
        
        {/* Slogan */}
        <motion.p
          className="mt-6 md:mt-8 font-serif text-ink-light text-lg sm:text-xl md:text-2xl italic tracking-wide"
          initial={{ opacity: 0, y: 20 }}
          animate={isLoaded ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          {slogan}
        </motion.p>
        
        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ duration: 0.8, delay: 1.2 }}
        >
          <span className="text-ink-muted text-xs tracking-[0.3em] uppercase font-sans">
            Cuộn để khám phá
          </span>
          <motion.div
            className="w-px h-12 bg-gradient-to-b from-ink-muted to-transparent"
            animate={{ 
              scaleY: [1, 0.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </motion.div>
      </motion.div>
      
      {/* Decorative corner elements */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l border-t border-ink/10" />
      <div className="absolute top-8 right-8 w-16 h-16 border-r border-t border-ink/10" />
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l border-b border-ink/10" />
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r border-b border-ink/10" />
    </section>
  )
}
