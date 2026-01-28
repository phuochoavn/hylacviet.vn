"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRef, useState } from "react"

interface Product {
    id: string
    title: string
    handle: string
    thumbnail?: string
    images?: { url: string }[]
    price?: { calculated_price?: number }
    description?: string
}

const SpotlightShowcase = ({ product }: { product?: Product }) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [activeImageIndex, setActiveImageIndex] = useState(0)

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"],
    })

    const y = useTransform(scrollYProgress, [0, 1], [80, -80])

    // Skip if no product
    if (!product) return null

    // Get all images
    const images = product.images?.length
        ? product.images.map((img) => img.url)
        : product.thumbnail
            ? [product.thumbnail]
            : ["https://images.unsplash.com/photo-1550614000-4b9519e09647?q=80&w=2000&auto=format&fit=crop"]

    const currentImage = images[activeImageIndex] || images[0]

    // Format price
    const formattedPrice = product.price?.calculated_price
        ? new Intl.NumberFormat("vi-VN").format(product.price.calculated_price) + "₫"
        : null

    return (
        <section
            ref={containerRef}
            className="relative py-20 lg:py-32 bg-paper-warm overflow-hidden"
        >
            {/* Background Text Decoration */}
            <div className="absolute top-1/2 -translate-y-1/2 right-0 overflow-hidden pointer-events-none opacity-[0.03]">
                <span className="block text-[15vw] font-display text-ink leading-none whitespace-nowrap">
                    Masterpiece
                </span>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                {/* Section Header */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                >
                    <span className="inline-flex items-center gap-3 font-sans text-xs tracking-[0.4em] uppercase text-ink-muted mb-4">
                        <span className="w-8 h-px bg-silk-gold" />
                        Tiêu Điểm
                        <span className="w-8 h-px bg-silk-gold" />
                    </span>
                    <h2 className="font-display text-4xl md:text-5xl text-ink">
                        Tác Phẩm Nổi Bật
                    </h2>
                </motion.div>

                <div className="flex flex-col lg:flex-row items-stretch gap-8 lg:gap-16">
                    {/* Left: Image Gallery */}
                    <motion.div
                        className="w-full lg:w-3/5"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                    >
                        {/* Main Image */}
                        <div className="relative aspect-[3/4] overflow-hidden bg-paper group">
                            <Image
                                src={currentImage}
                                alt={product.title}
                                fill
                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                priority
                            />

                            {/* Hover overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                            {/* Badge */}
                            <div className="absolute top-6 left-6">
                                <span className="inline-block bg-silk-gold text-white font-sans text-xs tracking-widest uppercase px-4 py-2">
                                    Bestseller
                                </span>
                            </div>

                            {/* Quick view button */}
                            <div className="absolute bottom-6 left-6 right-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                                <Link
                                    href={`/vn/products/${product.handle}`}
                                    className="block w-full bg-paper/95 backdrop-blur-sm text-center py-4 font-sans text-sm tracking-widest uppercase text-ink hover:bg-paper transition-colors"
                                >
                                    Xem Nhanh
                                </Link>
                            </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        {images.length > 1 && (
                            <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
                                {images.slice(0, 5).map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setActiveImageIndex(index)}
                                        className={`relative flex-shrink-0 w-20 h-24 overflow-hidden transition-all duration-300 ${activeImageIndex === index
                                                ? "ring-2 ring-ink ring-offset-2"
                                                : "opacity-60 hover:opacity-100"
                                            }`}
                                    >
                                        <Image
                                            src={img}
                                            alt={`${product.title} - Ảnh ${index + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Right: Product Info */}
                    <motion.div
                        className="w-full lg:w-2/5 flex flex-col justify-center"
                        style={{ y }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                        >
                            {/* Category */}
                            <span className="inline-block font-sans text-xs tracking-[0.3em] uppercase text-ink-muted mb-4">
                                Áo Dài Cao Cấp
                            </span>

                            {/* Title */}
                            <h3 className="font-display text-4xl lg:text-5xl xl:text-6xl text-ink mb-6 leading-tight">
                                {product.title}
                            </h3>

                            {/* Rating */}
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex gap-1">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className="w-4 h-4 text-silk-gold fill-current"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                        </svg>
                                    ))}
                                </div>
                                <span className="font-sans text-sm text-ink-muted">
                                    (128 đánh giá)
                                </span>
                            </div>

                            {/* Price */}
                            {formattedPrice && (
                                <div className="mb-8">
                                    <span className="font-display text-3xl text-ink">
                                        {formattedPrice}
                                    </span>
                                </div>
                            )}

                            {/* Description */}
                            <div className="space-y-4 font-sans text-ink-light leading-relaxed mb-10">
                                <p>
                                    {product.description ||
                                        "Đây không chỉ là một chiếc áo. Đây là biểu tượng của sự thanh thoát và khí chất người mặc. Được dệt từ những sợi tơ tằm thượng hạng nhất, chiếc áo này ôm lấy cơ thể như một làn nước mát lành."}
                                </p>
                            </div>

                            {/* Features */}
                            <div className="grid grid-cols-2 gap-4 mb-10">
                                {[
                                    { icon: "✦", text: "100% Thủ công" },
                                    { icon: "✦", text: "Tơ tằm cao cấp" },
                                    { icon: "✦", text: "Bảo hành 1 năm" },
                                    { icon: "✦", text: "Miễn phí sửa size" },
                                ].map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <span className="text-silk-gold text-sm">{feature.icon}</span>
                                        <span className="font-sans text-sm text-ink-muted">
                                            {feature.text}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* CTA */}
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href={`/vn/products/${product.handle}`}
                                    className="flex-1 inline-flex items-center justify-center px-8 py-4 bg-ink text-paper font-sans text-sm tracking-[0.15em] uppercase hover:bg-ink/90 transition-colors"
                                >
                                    Xem Chi Tiết
                                </Link>
                                <button className="flex-1 inline-flex items-center justify-center px-8 py-4 border border-ink text-ink font-sans text-sm tracking-[0.15em] uppercase hover:bg-ink hover:text-paper transition-colors">
                                    Thêm Vào Giỏ
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default SpotlightShowcase
