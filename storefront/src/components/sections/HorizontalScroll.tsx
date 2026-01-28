"use client"

import { motion, useScroll, useTransform, useSpring, useMotionValueEvent } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRef, useState } from "react"

interface GalleryItem {
  id: string
  image: string
  title: string
  subtitle?: string
  href?: string
  price?: string
}

const defaultItems: GalleryItem[] = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=800&auto=format&fit=crop",
    title: "Áo Dài Cưới",
    subtitle: "Cho ngày trọng đại",
    href: "/vn/categories/ao-dai-cuoi",
    price: "12.000.000₫",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?q=80&w=800&auto=format&fit=crop",
    title: "Áo Dài Lụa",
    subtitle: "Tinh hoa tơ tằm",
    href: "/vn/categories/ao-dai-lua",
    price: "8.500.000₫",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1590103514924-c9e1e8b8e4b0?q=80&w=800&auto=format&fit=crop",
    title: "Áo Dài Gấm",
    subtitle: "Hoa văn truyền thống",
    href: "/vn/categories/ao-dai-gam",
    price: "15.000.000₫",
  },
  {
    id: "4",
    image: "https://images.unsplash.com/photo-1583391733981-8b530b07d7f3?q=80&w=800&auto=format&fit=crop",
    title: "Áo Dài Cách Tân",
    subtitle: "Phong cách hiện đại",
    href: "/vn/categories/ao-dai-cach-tan",
    price: "6.500.000₫",
  },
  {
    id: "5",
    image: "https://images.unsplash.com/photo-1590103514966-5e2a11c13e21?q=80&w=800&auto=format&fit=crop",
    title: "Áo Dài Thêu Tay",
    subtitle: "Nghệ thuật thủ công",
    href: "/vn/categories/ao-dai-theu",
    price: "18.000.000₫",
  },
]

interface HorizontalScrollProps {
  items?: GalleryItem[]
  title?: string
  subtitle?: string
}

export default function HorizontalScroll({
  items = defaultItems,
  title = "Khám Phá Bộ Sưu Tập",
  subtitle = "Cuộn để khám phá",
}: HorizontalScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Smooth spring animation for x position
  const xRaw = useTransform(
    scrollYProgress,
    [0, 1],
    ["0%", `-${(items.length) * 25}%`]
  )
  const x = useSpring(xRaw, { stiffness: 100, damping: 30, restDelta: 0.001 })

  // Track active index for styling
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const index = Math.round(latest * items.length)
    setActiveIndex(Math.min(index, items.length - 1))
  })

  // Background color transition
  const bgOpacity = useTransform(scrollYProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0])

  return (
    <section
      ref={containerRef}
      className="relative bg-ink"
      style={{ height: `${(items.length + 1) * 100}vh` }}
    >
      {/* Sticky container */}
      <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
        {/* Header */}
        <motion.div
          className="flex-shrink-0 px-6 md:px-12 pt-12 md:pt-16 pb-6 md:pb-8"
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Section label */}
          <div className="flex items-center gap-4 mb-4">
            <motion.span
              className="w-12 h-px bg-silk-gold"
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <span className="font-sans text-[10px] md:text-xs tracking-[0.3em] uppercase text-paper/40">
              Gallery
            </span>
          </div>

          {/* Title with gradient */}
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-paper mb-2 leading-tight">
            {title.split(" ").map((word, i) => (
              <span key={i} className={i === title.split(" ").length - 1 ? "text-silk-gold" : ""}>
                {word}{" "}
              </span>
            ))}
          </h2>

          {/* Subtitle with scroll hint */}
          <div className="flex items-center gap-4">
            <p className="font-sans text-sm text-paper/40">{subtitle}</p>
            <motion.div
              className="flex items-center gap-2"
              animate={{ x: [0, 10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="w-8 h-px bg-paper/20" />
              <svg className="w-4 h-4 text-paper/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Horizontal scroll container */}
        <div className="flex-1 flex items-center overflow-hidden">
          <motion.div className="flex gap-4 md:gap-8 pl-6 md:pl-12" style={{ x }}>
            {items.map((item, index) => (
              <GalleryCard
                key={item.id}
                item={item}
                index={index}
                isActive={index === activeIndex}
                scrollProgress={scrollYProgress}
              />
            ))}

            {/* End CTA card */}
            <motion.div
              className="flex-shrink-0 w-[75vw] md:w-[50vw] lg:w-[30vw] aspect-[3/4] flex items-center justify-center bg-paper/5 border border-paper/10"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div className="text-center px-8">
                <motion.span
                  className="block font-display text-6xl text-paper/10 mb-6"
                  animate={{ rotate: [0, 180, 360] }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  ✦
                </motion.span>
                <h3 className="font-serif text-2xl text-paper italic mb-4">
                  Xem tất cả bộ sưu tập
                </h3>
                <Link
                  href="/vn/store"
                  className="group inline-flex items-center gap-2 font-sans text-sm tracking-widest uppercase text-paper border border-paper/30 px-8 py-4 hover:bg-paper hover:text-ink transition-colors duration-300"
                  data-cursor
                  data-cursor-text="Xem"
                >
                  Khám phá
                  <svg
                    className="w-4 h-4 transform group-hover:translate-x-2 transition-transform"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>

        {/* Bottom progress bar */}
        <div className="flex-shrink-0 px-6 md:px-12 py-6 md:py-8">
          <div className="flex items-center gap-4">
            {/* Current index */}
            <motion.span
              className="font-display text-2xl text-paper/30 min-w-[3ch]"
              key={activeIndex}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              {String(activeIndex + 1).padStart(2, "0")}
            </motion.span>

            {/* Progress track */}
            <div className="flex-1 h-[2px] bg-paper/10 overflow-hidden rounded-full">
              <motion.div
                className="h-full bg-gradient-to-r from-silk-gold to-silk-rose origin-left"
                style={{ scaleX: scrollYProgress }}
              />
            </div>

            {/* Total count */}
            <span className="font-sans text-xs text-paper/30">
              {String(items.length).padStart(2, "0")}
            </span>
          </div>

          {/* Dot indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {items.map((_, index) => (
              <motion.div
                key={index}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "bg-silk-gold w-6" : "bg-paper/20"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

// Individual gallery card component
function GalleryCard({
  item,
  index,
  isActive,
  scrollProgress,
}: {
  item: GalleryItem
  index: number
  isActive: boolean
  scrollProgress: ReturnType<typeof useScroll>["scrollYProgress"]
}) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isHovered, setIsHovered] = useState(false)

  // Parallax effect for each card
  const y = useTransform(
    scrollProgress,
    [0, 1],
    [index % 2 === 0 ? 30 : -30, index % 2 === 0 ? -30 : 30]
  )

  return (
    <motion.div
      ref={cardRef}
      className="relative flex-shrink-0 w-[75vw] md:w-[50vw] lg:w-[30vw]"
      style={{ y }}
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link
        href={item.href || "#"}
        className="block relative aspect-[3/4] overflow-hidden group"
        data-cursor
        data-cursor-text="Xem"
      >
        {/* Image container */}
        <motion.div
          className="absolute inset-0"
          animate={{ scale: isHovered ? 1.08 : 1 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
        >
          <Image
            src={item.image}
            alt={item.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 75vw, (max-width: 1024px) 50vw, 30vw"
          />
        </motion.div>

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/30 to-transparent opacity-70" />

        {/* Hover gradient */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-t from-silk-gold/30 via-transparent to-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
        />

        {/* Index number */}
        <motion.div
          className="absolute top-6 left-6"
          animate={{ opacity: isHovered ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        >
          <span className="font-display text-7xl md:text-8xl text-paper/10">
            {String(index + 1).padStart(2, "0")}
          </span>
        </motion.div>

        {/* Decorative corner */}
        <motion.div
          className="absolute top-4 right-4"
          animate={{
            scale: isHovered ? 1.2 : 1,
            borderColor: isHovered ? "rgba(212, 175, 55, 0.5)" : "rgba(255, 255, 255, 0.2)",
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="w-8 h-8 border-t border-r border-paper/20" />
        </motion.div>

        {/* Content */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          {/* Subtitle */}
          <motion.span
            className="block font-sans text-[10px] md:text-xs tracking-[0.2em] uppercase text-paper/50 mb-2"
            animate={{ y: isHovered ? -5 : 0 }}
            transition={{ duration: 0.3 }}
          >
            {item.subtitle}
          </motion.span>

          {/* Title */}
          <motion.h3
            className="font-display text-2xl md:text-3xl text-paper mb-3"
            animate={{ y: isHovered ? -5 : 0 }}
            transition={{ duration: 0.3, delay: 0.05 }}
          >
            {item.title}
          </motion.h3>

          {/* Price */}
          {item.price && (
            <motion.span
              className="block font-sans text-sm text-silk-gold mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 10 }}
              transition={{ duration: 0.3 }}
            >
              Từ {item.price}
            </motion.span>
          )}

          {/* CTA */}
          <motion.div
            className="flex items-center gap-2"
            animate={{ x: isHovered ? 10 : 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
          >
            <span className="font-sans text-sm text-paper/70 group-hover:text-paper transition-colors">
              Xem bộ sưu tập
            </span>
            <motion.svg
              className="w-4 h-4 text-paper/70"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ x: isHovered ? 5 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </motion.svg>
          </motion.div>
        </div>

        {/* Active indicator border */}
        <motion.div
          className="absolute inset-0 border-2 border-silk-gold pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: isActive ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </Link>
    </motion.div>
  )
}
