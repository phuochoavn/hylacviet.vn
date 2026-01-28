"use client"

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useRef, useState, useEffect } from "react"
import { FadeUp } from "@/components/ui/TextReveal"

interface StorySection {
  id: string
  tag: string
  title: string
  description: string
  image: string
  accent?: string
}

const defaultStorySections: StorySection[] = [
  {
    id: "heritage",
    tag: "Di Sản",
    title: "Tiếp nối truyền thống",
    description:
      "Từ những sợi tơ tằm được nuôi dưỡng trên vùng đất Việt Nam, chúng tôi tiếp nối di sản dệt may truyền thống đã có từ hàng nghìn năm. Mỗi chiếc áo dài Mai Đỏ là một câu chuyện về nguồn cội.",
    image:
      "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1600&auto=format&fit=crop",
    accent: "silk-gold",
  },
  {
    id: "craftsmanship",
    tag: "Thủ Công",
    title: "Nghệ thuật trong từng đường kim",
    description:
      "Mỗi chiếc áo dài được may đo riêng bởi những nghệ nhân lành nghề với hơn 20 năm kinh nghiệm. Từ việc cắt vải, khâu tay cho đến thêu hoa văn, tất cả đều được thực hiện với sự tỉ mỉ tuyệt đối.",
    image:
      "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?q=80&w=1600&auto=format&fit=crop",
    accent: "silk-rose",
  },
  {
    id: "innovation",
    tag: "Đổi Mới",
    title: "Hiện đại trong hơi thở mới",
    description:
      "Kết hợp giữa nét đẹp truyền thống và phong cách đương đại, Mai Đỏ mang đến những thiết kế độc đáo phù hợp với phong cách sống hiện đại mà vẫn giữ nguyên hồn Việt.",
    image:
      "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=1600&auto=format&fit=crop",
    accent: "silk-pearl",
  },
]

interface StickyScrollStoryProps {
  sections?: StorySection[]
  title?: string
  subtitle?: string
}

export default function StickyScrollStory({
  sections = defaultStorySections,
  title = "Câu Chuyện Mai Đỏ",
  subtitle = "Hành trình của vẻ đẹp",
}: StickyScrollStoryProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeSection, setActiveSection] = useState(0)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  })

  // Calculate which section is active based on scroll progress
  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (v) => {
      const sectionIndex = Math.min(
        Math.floor(v * sections.length),
        sections.length - 1
      )
      setActiveSection(sectionIndex)
    })
    return () => unsubscribe()
  }, [scrollYProgress, sections.length])

  // Image scale and opacity based on scroll
  const imageScale = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1.05, 1.1])

  return (
    <section
      ref={containerRef}
      className="relative bg-paper"
      style={{ height: `${(sections.length + 0.5) * 100}vh` }}
    >
      {/* Sticky image container - Left side */}
      <div className="sticky top-0 h-screen flex">
        {/* Image side (50% on desktop, full on mobile) */}
        <div className="relative w-full lg:w-1/2 h-[50vh] lg:h-full overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={sections[activeSection].id}
              className="absolute inset-0"
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <motion.div className="relative w-full h-full" style={{ scale: imageScale }}>
                <Image
                  src={sections[activeSection].image}
                  alt={sections[activeSection].title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  priority
                />
                {/* Gradient overlay for text readability on mobile */}
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-paper/90 lg:hidden" />
                {/* Subtle gradient on desktop */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-paper/30 hidden lg:block" />
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Floating tag badge */}
          <motion.div
            className="absolute top-8 left-8 z-10"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="bg-paper/90 backdrop-blur-sm px-4 py-2 shadow-lg">
              <AnimatePresence mode="wait">
                <motion.span
                  key={sections[activeSection].tag}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted"
                >
                  {sections[activeSection].tag}
                </motion.span>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Progress indicator - Desktop */}
          <div className="hidden lg:flex absolute bottom-8 left-8 z-10 flex-col gap-2">
            {sections.map((_, index) => (
              <motion.div
                key={index}
                className="relative h-12 w-px bg-ink/10 overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <motion.div
                  className="absolute top-0 left-0 w-full bg-silk-gold"
                  initial={{ height: "0%" }}
                  animate={{
                    height: index < activeSection ? "100%" : index === activeSection ? "50%" : "0%",
                  }}
                  transition={{ duration: 0.5 }}
                />
              </motion.div>
            ))}
          </div>

          {/* Section number */}
          <div className="absolute bottom-8 right-8 z-10 hidden lg:block">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeSection}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="font-display text-8xl text-paper/20"
              >
                {String(activeSection + 1).padStart(2, "0")}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        {/* Content side (50% on desktop) - Hidden on mobile, content flows below */}
        <div className="hidden lg:flex w-1/2 h-full items-center px-12 xl:px-20">
          <div className="max-w-xl">
            {/* Section header */}
            <FadeUp delay={0.2}>
              <div className="flex items-center gap-4 mb-6">
                <span className="w-12 h-px bg-silk-gold" />
                <span className="font-sans text-xs tracking-[0.3em] uppercase text-ink-muted">
                  {subtitle}
                </span>
              </div>
            </FadeUp>

            {/* Dynamic title */}
            <AnimatePresence mode="wait">
              <motion.div
                key={sections[activeSection].id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <h2 className="font-display text-4xl xl:text-5xl 2xl:text-6xl text-ink leading-tight mb-6">
                  {sections[activeSection].title}
                </h2>
                <p className="font-serif text-lg xl:text-xl text-ink-light leading-relaxed mb-8">
                  {sections[activeSection].description}
                </p>
              </motion.div>
            </AnimatePresence>

            {/* CTA */}
            <FadeUp delay={0.4}>
              <a
                href="/vn/about"
                className="group inline-flex items-center gap-3 font-sans text-sm tracking-[0.15em] uppercase text-ink hover:text-silk-gold transition-colors"
                data-cursor
                data-cursor-text="Đọc"
              >
                Khám phá câu chuyện
                <svg
                  className="w-5 h-5 transform group-hover:translate-x-2 transition-transform"
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
              </a>
            </FadeUp>
          </div>
        </div>
      </div>

      {/* Mobile content - Scrollable text sections */}
      <div className="lg:hidden absolute top-[50vh] left-0 right-0">
        {sections.map((section, index) => (
          <div
            key={section.id}
            className="min-h-[50vh] flex items-center px-6 py-12"
          >
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-20%" }}
              transition={{ duration: 0.8 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="w-8 h-px bg-silk-gold" />
                <span className="font-sans text-xs tracking-[0.2em] uppercase text-ink-muted">
                  {section.tag}
                </span>
              </div>
              <h3 className="font-display text-3xl text-ink leading-tight mb-4">
                {section.title}
              </h3>
              <p className="font-serif text-base text-ink-light leading-relaxed">
                {section.description}
              </p>
            </motion.div>
          </div>
        ))}
      </div>

      {/* Section title - appears on scroll */}
      <motion.div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none hidden xl:block"
        style={{
          opacity: useTransform(scrollYProgress, [0.1, 0.2, 0.8, 0.9], [0, 1, 1, 0]),
        }}
      >
        <span
          className="font-display text-[15vw] text-ink/[0.02] whitespace-nowrap select-none"
          style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
        >
          {title}
        </span>
      </motion.div>
    </section>
  )
}
