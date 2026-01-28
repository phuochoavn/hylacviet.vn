'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

export default function StorySection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  })

  const imageY = useTransform(scrollYProgress, [0, 1], [100, -100])
  const textY = useTransform(scrollYProgress, [0, 1], [50, -50])

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen bg-paper py-24 md:py-32 overflow-hidden"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Image Side */}
          <motion.div
            className="relative"
            style={{ y: imageY }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative aspect-[3/4] bg-paper-warm overflow-hidden"
            >
              <Image
                src="/story-image.jpg"
                alt="Nghệ nhân thêu tay"
                fill
                className="object-cover"
              />

              {/* Decorative gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-silk-pearl/20 via-transparent to-silk-rose/20" />

              {/* Decorative frame */}
              <div className="absolute inset-6 border border-ink/10 z-10" />

              {/* Floating accent */}
              <motion.div
                className="absolute -right-8 -bottom-8 w-32 h-32 bg-paper border border-ink/10"
                initial={{ opacity: 0, x: 20 }}
                animate={isInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.4 }}
              />
            </motion.div>

            {/* Caption */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mt-6 font-sans text-xs text-ink-muted tracking-widest uppercase"
            >
              Nghệ nhân đang thêu tay họa tiết truyền thống
            </motion.p>
          </motion.div>

          {/* Text Side */}
          <motion.div
            className="lg:pl-12"
            style={{ y: textY }}
          >
            <motion.span
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-block font-sans text-xs tracking-[0.3em] uppercase text-ink-muted mb-6"
            >
              Câu chuyện của chúng tôi
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="font-display text-3xl md:text-4xl lg:text-5xl text-ink mb-8 leading-tight"
            >
              Nơi di sản <br />
              <span className="italic">gặp gỡ</span> đương đại
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-6 font-serif text-ink-light text-lg leading-relaxed"
            >
              <p>
                Mai Đo ra đời từ tình yêu với vẻ đẹp vượt thời gian của trang phục truyền thống Việt Nam.
                Chúng tôi tin rằng mỗi đường kim mũi chỉ đều kể một câu chuyện — về di sản, về sự tỉ mỉ,
                và về người phụ nữ khoác lên mình tác phẩm ấy.
              </p>
              <p>
                Từ lụa tơ tằm Hà Đông đến gấm Thái Tuấn, mỗi chất liệu được chọn lọc kỹ càng,
                mỗi họa tiết được thêu tay bởi những nghệ nhân giàu kinh nghiệm.
              </p>
            </motion.div>

            {/* CTA */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-10"
            >
              <Link
                href="/vn/about"
                className="group inline-flex items-center gap-4 font-sans text-sm tracking-widest uppercase text-ink hover:text-ink-midnight transition-colors duration-300"
              >
                <span>Tìm hiểu thêm</span>
                <span className="w-12 h-px bg-ink group-hover:w-16 transition-all duration-300" />
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Background decorative text */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 pointer-events-none select-none overflow-hidden w-full">
        <motion.p
          className="font-display text-[15vw] text-ink/[0.02] whitespace-nowrap"
          animate={{ x: [0, -500] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          Mai Đo • Tinh hoa Việt • Mai Đo • Tinh hoa Việt •
        </motion.p>
      </div>
    </section>
  )
}
