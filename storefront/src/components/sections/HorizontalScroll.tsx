"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRef } from "react"

interface GalleryItem {
    id: string
    image: string
    title: string
    subtitle?: string
    href?: string
}

const defaultItems: GalleryItem[] = [
    {
        id: "1",
        image: "https://images.unsplash.com/photo-1583391733956-6c78276477e2?q=80&w=800&auto=format&fit=crop",
        title: "Áo Dài Cưới",
        subtitle: "Cho ngày trọng đại",
        href: "/vn/categories/ao-dai-cuoi",
    },
    {
        id: "2",
        image: "https://images.unsplash.com/photo-1617019114583-affb34d1b3cd?q=80&w=800&auto=format&fit=crop",
        title: "Áo Dài Lụa",
        subtitle: "Tinh hoa tơ tằm",
        href: "/vn/categories/ao-dai-lua",
    },
    {
        id: "3",
        image: "https://images.unsplash.com/photo-1590103514924-c9e1e8b8e4b0?q=80&w=800&auto=format&fit=crop",
        title: "Áo Dài Gấm",
        subtitle: "Hoa văn truyền thống",
        href: "/vn/categories/ao-dai-gam",
    },
    {
        id: "4",
        image: "https://images.unsplash.com/photo-1583391733981-8b530b07d7f3?q=80&w=800&auto=format&fit=crop",
        title: "Áo Dài Cách Tân",
        subtitle: "Phong cách hiện đại",
        href: "/vn/categories/ao-dai-cach-tan",
    },
    {
        id: "5",
        image: "https://images.unsplash.com/photo-1590103514966-5e2a11c13e21?q=80&w=800&auto=format&fit=crop",
        title: "Áo Dài Thêu Tay",
        subtitle: "Nghệ thuật thủ công",
        href: "/vn/categories/ao-dai-theu",
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
    subtitle = "Cuộn ngang để xem thêm ↔",
}: HorizontalScrollProps) {
    const containerRef = useRef<HTMLDivElement>(null)
    const scrollRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"],
    })

    // Calculate horizontal scroll based on vertical progress
    const x = useTransform(
        scrollYProgress,
        [0, 1],
        ["0%", `-${(items.length - 1) * 100}%`]
    )

    return (
        <section ref={containerRef} className="relative h-[300vh] bg-ink">
            {/* Sticky container */}
            <div className="sticky top-0 h-screen flex flex-col overflow-hidden">
                {/* Header */}
                <div className="flex-shrink-0 px-8 pt-12 pb-8">
                    <motion.div
                        className="flex items-center gap-4 mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <span className="w-12 h-px bg-silk-gold" />
                        <span className="font-sans text-xs tracking-[0.3em] uppercase text-paper/50">
                            Gallery
                        </span>
                    </motion.div>
                    <h2 className="font-display text-4xl md:text-5xl text-paper mb-2">
                        {title}
                    </h2>
                    <p className="font-sans text-sm text-paper/50">{subtitle}</p>
                </div>

                {/* Horizontal scroll container */}
                <div ref={scrollRef} className="flex-1 flex items-center overflow-hidden">
                    <motion.div
                        className="flex gap-8 px-8"
                        style={{ x }}
                    >
                        {items.map((item, index) => (
                            <motion.div
                                key={item.id}
                                className="relative flex-shrink-0 w-[80vw] md:w-[50vw] lg:w-[35vw] aspect-[3/4] group"
                                initial={{ opacity: 0, scale: 0.9 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    href={item.href || "#"}
                                    className="block w-full h-full relative overflow-hidden"
                                    data-cursor
                                    data-cursor-text="Xem"
                                >
                                    {/* Image */}
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                                    />

                                    {/* Gradient overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent" />

                                    {/* Index number */}
                                    <div className="absolute top-6 left-6">
                                        <span className="font-display text-6xl text-paper/10">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                    </div>

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-8">
                                        <motion.div
                                            initial={{ y: 20, opacity: 0 }}
                                            whileInView={{ y: 0, opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: 0.2 + index * 0.1 }}
                                        >
                                            <span className="block font-sans text-xs tracking-widest uppercase text-paper/50 mb-2">
                                                {item.subtitle}
                                            </span>
                                            <h3 className="font-display text-3xl text-paper mb-4">
                                                {item.title}
                                            </h3>
                                            <span className="inline-flex items-center gap-2 font-sans text-sm text-paper/70 group-hover:text-paper transition-colors">
                                                Xem bộ sưu tập
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
                                            </span>
                                        </motion.div>
                                    </div>

                                    {/* Decorative corner */}
                                    <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-paper/20 group-hover:border-paper/50 transition-colors" />
                                </Link>
                            </motion.div>
                        ))}

                        {/* End CTA card */}
                        <div className="flex-shrink-0 w-[80vw] md:w-[50vw] lg:w-[35vw] aspect-[3/4] flex items-center justify-center bg-paper/5 border border-paper/10">
                            <div className="text-center px-8">
                                <span className="block font-display text-6xl text-paper/10 mb-4">✦</span>
                                <h3 className="font-serif text-2xl text-paper italic mb-4">
                                    Xem tất cả bộ sưu tập
                                </h3>
                                <Link
                                    href="/vn/store"
                                    className="inline-flex items-center gap-2 font-sans text-sm tracking-widest uppercase text-paper border border-paper/30 px-8 py-4 hover:bg-paper hover:text-ink transition-colors"
                                >
                                    Khám phá
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                                    </svg>
                                </Link>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Progress indicator */}
                <div className="flex-shrink-0 px-8 py-8">
                    <div className="flex items-center gap-4">
                        <span className="font-sans text-xs text-paper/50">
                            {String(1).padStart(2, "0")}
                        </span>
                        <div className="flex-1 h-px bg-paper/10 overflow-hidden">
                            <motion.div
                                className="h-full bg-silk-gold origin-left"
                                style={{ scaleX: scrollYProgress }}
                            />
                        </div>
                        <span className="font-sans text-xs text-paper/50">
                            {String(items.length).padStart(2, "0")}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
