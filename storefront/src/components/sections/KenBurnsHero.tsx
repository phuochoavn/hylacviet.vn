"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRef, useState, useEffect, useCallback } from "react"

interface HeroSlide {
  id: string
  image: string
  video?: string
  title: string
  subtitle: string
}

const defaultSlides: HeroSlide[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1587467512961-120760940315?q=80&w=2600&auto=format&fit=crop",
    title: "Di sản trong hơi thở mới",
    subtitle: "Bộ sưu tập Xuân Hè 2026",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=2600&auto=format&fit=crop",
    title: "Tinh hoa tơ lụa Việt",
    subtitle: "Áo dài cưới cao cấp",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?q=80&w=2600&auto=format&fit=crop",
    title: "Nghệ thuật thủ công",
    subtitle: "Thiết kế độc quyền",
  },
]

interface KenBurnsHeroProps {
  slides?: HeroSlide[]
  heroVideo?: string | null
  autoPlayInterval?: number
}

export default function KenBurnsHero({
  slides = defaultSlides,
  heroVideo,
  autoPlayInterval = 6000,
}: KenBurnsHeroProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward

  // Scroll progress for parallax effects
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const overlayOpacity = useTransform(scrollYProgress, [0, 0.5], [0.3, 0.7])
  const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -100])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.4], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.15])

  // Initialize
  useEffect(() => {
    setIsLoaded(true)
  }, [])

  // Auto-play slideshow
  useEffect(() => {
    if (heroVideo) return // Don't auto-play if video is primary

    const interval = setInterval(() => {
      setDirection(1)
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, autoPlayInterval)

    return () => clearInterval(interval)
  }, [slides.length, autoPlayInterval, heroVideo])

  // Handle slide navigation
  const goToSlide = useCallback((index: number) => {
    setDirection(index > currentSlide ? 1 : -1)
    setCurrentSlide(index)
  }, [currentSlide])

  // Ken Burns animation variants - slow zoom with subtle pan
  const kenBurnsVariants = {
    initial: (direction: number) => ({
      scale: 1.1,
      x: direction > 0 ? "5%" : "-5%",
      opacity: 0,
    }),
    animate: {
      scale: [1.1, 1.2],
      x: ["0%", "-3%"],
      opacity: 1,
      transition: {
        scale: {
          duration: autoPlayInterval / 1000 + 2,
          ease: "linear",
        },
        x: {
          duration: autoPlayInterval / 1000 + 2,
          ease: "linear",
        },
        opacity: {
          duration: 1.5,
          ease: "easeOut",
        },
      },
    },
    exit: {
      opacity: 0,
      transition: {
        duration: 1,
        ease: "easeInOut",
      },
    },
  }

  // Text reveal animation variants
  const lineVariants = {
    hidden: { y: "100%", opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        duration: 1,
        delay: i * 0.15 + 0.5,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    }),
  }

  const slide = slides[currentSlide]

  return (
    <section
      ref={containerRef}
      className="relative h-[100svh] w-full overflow-hidden bg-ink"
    >
      {/* Video or Image Slideshow with Ken Burns */}
      <div className="absolute inset-0">
        {heroVideo ? (
          <motion.div className="absolute inset-0" style={{ scale }}>
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src={heroVideo} type="video/mp4" />
            </video>
          </motion.div>
        ) : (
          <AnimatePresence mode="sync" custom={direction}>
            <motion.div
              key={slide.id}
              className="absolute inset-0"
              custom={direction}
              variants={kenBurnsVariants}
              initial="initial"
              animate="animate"
              exit="exit"
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={currentSlide === 0}
                sizes="100vw"
                quality={90}
              />
            </motion.div>
          </AnimatePresence>
        )}

        {/* Gradient overlays */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-b from-ink/40 via-ink/20 to-ink/60"
          style={{ opacity: overlayOpacity }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/50 via-transparent to-ink/30" />

        {/* Grain texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Main Content */}
      <motion.div
        className="relative z-10 h-full flex flex-col justify-end pb-24 md:pb-32 lg:pb-40"
        style={{ y: contentY, opacity: contentOpacity }}
      >
        <div className="container mx-auto px-6 md:px-12 lg:px-20">
          {/* Brand badge */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="inline-flex items-center gap-4">
              <span className="w-16 h-px bg-silk-gold" />
              <span className="font-sans text-xs tracking-[0.4em] uppercase text-paper/70">
                Since 2016
              </span>
            </div>
          </motion.div>

          {/* Brand name with character reveal */}
          <div className="mb-6">
            <div className="overflow-hidden">
              <motion.h1
                className="font-display text-[clamp(3rem,12vw,10rem)] text-paper leading-[0.85] tracking-[-0.02em]"
                variants={lineVariants}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                custom={0}
              >
                MAI
              </motion.h1>
            </div>
            <div className="overflow-hidden">
              <motion.h1
                className="font-display text-[clamp(3rem,12vw,10rem)] text-silk-gold leading-[0.85] tracking-[-0.02em] italic"
                variants={lineVariants}
                initial="hidden"
                animate={isLoaded ? "visible" : "hidden"}
                custom={1}
              >
                DO
              </motion.h1>
            </div>
          </div>

          {/* Dynamic subtitle based on slide */}
          <AnimatePresence mode="wait">
            <motion.div
              key={slide.id}
              className="max-w-xl mb-10"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
            >
              <p className="font-serif text-xl md:text-2xl lg:text-3xl text-paper/90 italic leading-relaxed">
                "{slide.title}"
              </p>
              <p className="mt-2 font-sans text-sm text-paper/50 tracking-wider uppercase">
                {slide.subtitle}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 30 }}
            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 1.2 }}
          >
            <Link
              href="/vn/store"
              className="group relative inline-flex items-center gap-3 px-10 py-5 bg-paper text-ink font-sans text-sm tracking-[0.2em] uppercase overflow-hidden transition-colors hover:text-paper"
              data-cursor
              data-cursor-text="Xem"
            >
              <span className="absolute inset-0 bg-silk-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
              <span className="relative z-10">Khám Phá Ngay</span>
              <svg
                className="relative z-10 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </Link>
            <Link
              href="tel:+84123456789"
              className="group inline-flex items-center gap-3 px-10 py-5 border border-paper/30 text-paper font-sans text-sm tracking-[0.2em] uppercase hover:bg-paper/10 hover:border-paper transition-all duration-300"
              data-cursor
              data-cursor-text="Gọi"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
              </svg>
              0123.456.789
            </Link>
          </motion.div>
        </div>
      </motion.div>

      {/* Slide indicators */}
      {!heroVideo && slides.length > 1 && (
        <motion.div
          className="absolute bottom-8 right-8 z-20 flex flex-col items-end gap-4"
          initial={{ opacity: 0 }}
          animate={isLoaded ? { opacity: 1 } : {}}
          transition={{ delay: 1.5 }}
        >
          <div className="flex items-center gap-3">
            <span className="font-display text-3xl text-paper/30">
              {String(currentSlide + 1).padStart(2, "0")}
            </span>
            <span className="w-12 h-px bg-paper/30" />
            <span className="font-sans text-xs text-paper/50">
              {String(slides.length).padStart(2, "0")}
            </span>
          </div>
          <div className="flex gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentSlide
                    ? "bg-silk-gold w-8"
                    : "bg-paper/30 hover:bg-paper/50"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </motion.div>
      )}

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
        transition={{ delay: 2 }}
      >
        <span className="font-sans text-[10px] tracking-[0.3em] uppercase text-paper/50">
          Cuộn
        </span>
        <motion.div
          className="w-px h-16 bg-gradient-to-b from-paper/50 to-transparent overflow-hidden"
          initial={{ scaleY: 0 }}
          animate={{ scaleY: 1 }}
          transition={{ delay: 2.2, duration: 0.6 }}
        >
          <motion.div
            className="w-full h-4 bg-silk-gold"
            animate={{ y: ["-100%", "400%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>

      {/* Side decoration - Desktop only */}
      <motion.div
        className="hidden lg:block absolute left-8 top-1/2 -translate-y-1/2 z-10"
        style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        initial={{ opacity: 0, x: -20 }}
        animate={isLoaded ? { opacity: 0.4, x: 0 } : {}}
        transition={{ delay: 1.8 }}
      >
        <span className="font-sans text-[10px] tracking-[0.5em] uppercase text-paper/40">
          Áo Dài Việt Nam • Since 2016 • Handcrafted
        </span>
      </motion.div>
    </section>
  )
}
