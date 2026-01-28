"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRef, useState, useEffect } from "react"
import TextReveal, { CharReveal } from "@/components/ui/TextReveal"
import MagneticButton from "@/components/ui/MagneticButton"

interface CinematicHeroProps {
    heroImage?: string | null
    heroVideo?: string | null
}

const CinematicHero = ({ heroImage, heroVideo }: CinematicHeroProps) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isLoaded, setIsLoaded] = useState(false)
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"],
    })

    const imageScale = useTransform(scrollYProgress, [0, 1], [1, 1.2])
    const imageY = useTransform(scrollYProgress, [0, 1], [0, 200])
    const contentOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
    const contentY = useTransform(scrollYProgress, [0, 0.5], [0, -80])

    useEffect(() => {
        setIsLoaded(true)
    }, [])

    // Mouse parallax for image
    const handleMouseMove = (e: React.MouseEvent) => {
        const rect = containerRef.current?.getBoundingClientRect()
        if (!rect) return

        const x = (e.clientX - rect.left - rect.width / 2) / rect.width
        const y = (e.clientY - rect.top - rect.height / 2) / rect.height

        setMousePosition({ x: x * 20, y: y * 20 })
    }

    const imageSrc =
        heroImage ||
        "https://images.unsplash.com/photo-1587467512961-120760940315?q=80&w=2600&auto=format&fit=crop"

    return (
        <section
            ref={containerRef}
            onMouseMove={handleMouseMove}
            className="relative min-h-screen w-full overflow-hidden bg-paper"
        >
            {/* Split Layout Container */}
            <div className="flex flex-col lg:flex-row min-h-screen">

                {/* Left: Hero Image/Video (65%) */}
                <div className="relative w-full lg:w-[65%] h-[60vh] lg:h-screen overflow-hidden">
                    <motion.div
                        className="absolute inset-0"
                        style={{
                            scale: imageScale,
                            y: imageY,
                            x: mousePosition.x,
                            rotateY: mousePosition.x * 0.5,
                        }}
                    >
                        {heroVideo ? (
                            <video
                                autoPlay
                                loop
                                muted
                                playsInline
                                className="absolute inset-0 w-full h-full object-cover"
                            >
                                <source src={heroVideo} type="video/mp4" />
                            </video>
                        ) : (
                            <Image
                                src={imageSrc}
                                alt="Mai Đỏ - Di sản Áo Dài Việt Nam"
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 1024px) 100vw, 65vw"
                            />
                        )}

                        {/* Overlays */}
                        <div className="absolute inset-0 bg-gradient-to-r from-ink/20 via-transparent to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-t from-paper via-transparent to-transparent lg:hidden" />
                    </motion.div>

                    {/* Decorative Frame */}
                    <motion.div
                        className="absolute inset-8 border border-white/20 pointer-events-none hidden lg:block"
                        initial={{ opacity: 0 }}
                        animate={isLoaded ? { opacity: 1 } : {}}
                        transition={{ delay: 1.5, duration: 1 }}
                    />

                    {/* Floating Badge */}
                    <motion.div
                        className="absolute bottom-12 left-12 hidden lg:block"
                        initial={{ opacity: 0, y: 30 }}
                        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                        transition={{ delay: 2, duration: 0.8 }}
                    >
                        <div className="bg-paper/90 backdrop-blur-sm px-6 py-4 shadow-xl">
                            <span className="block font-sans text-xs tracking-[0.3em] uppercase text-ink-muted">
                                Thiết kế độc quyền
                            </span>
                            <span className="block font-serif text-lg text-ink mt-1">
                                Bộ sưu tập 2026
                            </span>
                        </div>
                    </motion.div>

                    {/* Scroll hint on image */}
                    <motion.div
                        className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:hidden"
                        initial={{ opacity: 0 }}
                        animate={isLoaded ? { opacity: 1 } : {}}
                        transition={{ delay: 2 }}
                    >
                        <motion.div
                            animate={{ y: [0, 10, 0] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="text-white/70"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                            </svg>
                        </motion.div>
                    </motion.div>
                </div>

                {/* Right: Content (35%) */}
                <motion.div
                    className="relative w-full lg:w-[35%] flex items-center justify-center px-8 py-16 lg:py-0 bg-paper"
                    style={{ opacity: contentOpacity, y: contentY }}
                >
                    <div className="max-w-md">
                        {/* Decorative line */}
                        <motion.div
                            className="flex items-center gap-4 mb-8"
                            initial={{ opacity: 0, x: -30 }}
                            animate={isLoaded ? { opacity: 1, x: 0 } : {}}
                            transition={{ delay: 0.5, duration: 0.8 }}
                        >
                            <span className="w-12 h-px bg-silk-gold" />
                            <span className="font-sans text-xs tracking-[0.4em] uppercase text-ink-muted">
                                Since 2016
                            </span>
                        </motion.div>

                        {/* Brand Name - Character reveal */}
                        <div className="overflow-hidden">
                            <motion.h1
                                className="font-display text-6xl md:text-7xl lg:text-8xl text-ink tracking-tight leading-none"
                                initial={{ y: "100%" }}
                                animate={isLoaded ? { y: 0 } : {}}
                                transition={{ delay: 0.7, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                            >
                                MAI
                            </motion.h1>
                        </div>
                        <div className="overflow-hidden">
                            <motion.h1
                                className="font-display text-6xl md:text-7xl lg:text-8xl text-silk-gold tracking-tight leading-none"
                                initial={{ y: "100%" }}
                                animate={isLoaded ? { y: 0 } : {}}
                                transition={{ delay: 0.9, duration: 1, ease: [0.25, 0.46, 0.45, 0.94] }}
                            >
                                ĐỎ
                            </motion.h1>
                        </div>

                        {/* Tagline */}
                        <motion.p
                            className="mt-8 font-serif text-xl md:text-2xl text-ink-light italic leading-relaxed overflow-hidden"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 1.2, duration: 0.8 }}
                        >
                            "Di sản trong hơi thở mới"
                        </motion.p>

                        {/* Description */}
                        <motion.p
                            className="mt-6 font-sans text-sm text-ink-muted leading-relaxed"
                            initial={{ opacity: 0, y: 20 }}
                            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 1.4, duration: 0.8 }}
                        >
                            Mỗi chiếc áo dài Mai Đỏ là một tác phẩm nghệ thuật,
                            được chế tác thủ công với tâm huyết của những nghệ nhân lành nghề.
                        </motion.p>

                        {/* CTA Buttons */}
                        <motion.div
                            className="mt-10 flex flex-col sm:flex-row gap-4"
                            initial={{ opacity: 0, y: 30 }}
                            animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                            transition={{ delay: 1.6, duration: 0.8 }}
                        >
                            <MagneticButton
                                href="/vn/store"
                                variant="primary"
                                size="lg"
                                cursorText="Xem"
                            >
                                Khám Phá Ngay
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                </svg>
                            </MagneticButton>

                            <MagneticButton
                                href="tel:+84123456789"
                                variant="secondary"
                                size="lg"
                                cursorText="Gọi"
                            >
                                Hotline: 0123.456.789
                            </MagneticButton>
                        </motion.div>

                        {/* Trust indicators */}
                        <motion.div
                            className="mt-12 pt-8 border-t border-ink/10"
                            initial={{ opacity: 0 }}
                            animate={isLoaded ? { opacity: 1 } : {}}
                            transition={{ delay: 1.8, duration: 0.8 }}
                        >
                            <div className="flex items-center gap-8">
                                {[
                                    { value: "10+", label: "Năm" },
                                    { value: "5000+", label: "Khách hàng" },
                                    { value: "100%", label: "Thủ công" },
                                ].map((stat, index) => (
                                    <motion.div
                                        key={stat.label}
                                        className="text-center"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                                        transition={{ delay: 2 + index * 0.1 }}
                                    >
                                        <span className="block font-display text-2xl text-ink">{stat.value}</span>
                                        <span className="block font-sans text-xs text-ink-muted uppercase tracking-wider">{stat.label}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    </div>
                </motion.div>
            </div>

            {/* Scroll Indicator - Desktop */}
            <motion.div
                className="hidden lg:flex absolute bottom-8 left-1/2 -translate-x-1/2 flex-col items-center gap-2 z-10"
                initial={{ opacity: 0, y: 20 }}
                animate={isLoaded ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 2.2, duration: 0.8 }}
            >
                <span className="font-sans text-xs tracking-[0.2em] uppercase text-ink-muted">
                    Cuộn để khám phá
                </span>
                <motion.div
                    className="w-px h-12 bg-gradient-to-b from-ink/40 to-transparent"
                    animate={{ scaleY: [1, 0.5, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                />
            </motion.div>

            {/* Side text decoration - Desktop */}
            <motion.div
                className="hidden xl:block absolute right-8 top-1/2 -translate-y-1/2 z-10"
                style={{ writingMode: "vertical-rl", textOrientation: "mixed" }}
                initial={{ opacity: 0 }}
                animate={isLoaded ? { opacity: 0.3 } : {}}
                transition={{ delay: 2 }}
            >
                <span className="font-sans text-xs tracking-[0.5em] uppercase text-ink-muted">
                    Áo Dài Việt Nam • Since 2016
                </span>
            </motion.div>
        </section>
    )
}

export default CinematicHero
