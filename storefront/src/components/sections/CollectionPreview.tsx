"use client"

import { useRef } from "react"
import { motion, useInView } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

interface Product {
  id: string
  title: string
  handle: string
  thumbnail?: string
  images?: { url: string }[]
  price?: string
}

interface CollectionPreviewProps {
  title?: string
  subtitle?: string
  products?: Product[]
}

const placeholderProducts: Product[] = [
  { id: "1", title: "Áo Dài Cưới Hoàng Gia", handle: "ao-dai-cuoi", price: "12.500.000₫" },
  { id: "2", title: "Áo Dài Lụa Tơ Tằm", handle: "ao-dai-lua", price: "8.900.000₫" },
  { id: "3", title: "Áo Dài Gấm Hoa Sen", handle: "ao-dai-gam", price: "6.500.000₫" },
  { id: "4", title: "Áo Dài Cách Tân", handle: "ao-dai-cach-tan", price: "4.500.000₫" },
  { id: "5", title: "Áo Dài Thêu Tay", handle: "ao-dai-theu", price: "15.000.000₫" },
  { id: "6", title: "Áo Dài Nhung", handle: "ao-dai-nhung", price: "9.800.000₫" },
]

// Define badges for products
const productBadges: Record<string, { text: string; color: string }> = {
  "1": { text: "Bán Chạy", color: "bg-silk-gold" },
  "2": { text: "Mới", color: "bg-emerald-600" },
  "5": { text: "Limited", color: "bg-rose-600" },
}

export default function CollectionPreview({
  title = "Bộ Sưu Tập",
  subtitle = "Mỗi tác phẩm là một hành trình của vẻ đẹp",
  products = placeholderProducts,
}: CollectionPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  // Bento grid layout pattern
  const getGridClass = (index: number) => {
    const patterns = [
      "col-span-2 row-span-2", // Large
      "col-span-1 row-span-1", // Small
      "col-span-1 row-span-1", // Small
      "col-span-1 row-span-2", // Tall
      "col-span-1 row-span-1", // Small
      "col-span-1 row-span-1", // Small
    ]
    return patterns[index % patterns.length]
  }

  return (
    <section ref={containerRef} className="py-24 lg:py-32 bg-paper overflow-hidden">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-flex items-center gap-3 font-sans text-xs tracking-[0.4em] uppercase text-ink-muted mb-4">
            <span className="w-8 h-px bg-silk-gold" />
            {title}
            <span className="w-8 h-px bg-silk-gold" />
          </span>
          <h2 className="font-serif text-3xl md:text-4xl lg:text-5xl text-ink italic">
            {subtitle}
          </h2>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-[200px] md:auto-rows-[250px]">
          {products.slice(0, 6).map((product, index) => {
            const badge = productBadges[product.id]
            const gridClass = getGridClass(index)

            return (
              <motion.div
                key={product.id}
                className={`relative group cursor-pointer ${gridClass}`}
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  href={`/vn/products/${product.handle}`}
                  className="block w-full h-full"
                >
                  {/* Image Container */}
                  <div className="relative w-full h-full overflow-hidden bg-paper-warm">
                    <Image
                      src={
                        product.thumbnail ||
                        product.images?.[0]?.url ||
                        `https://images.unsplash.com/photo-158521835606${index}-5e581e2858b9?q=80&w=800&auto=format&fit=crop`
                      }
                      alt={product.title}
                      fill
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/60 via-ink/0 to-ink/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    {/* Badge */}
                    {badge && (
                      <div className="absolute top-4 left-4 z-10">
                        <span
                          className={`inline-block ${badge.color} text-white font-sans text-[10px] tracking-widest uppercase px-3 py-1.5`}
                        >
                          {badge.text}
                        </span>
                      </div>
                    )}

                    {/* Product Info - Shows on hover */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out">
                      <h3 className="font-display text-lg md:text-xl text-white mb-1 line-clamp-2">
                        {product.title}
                      </h3>
                      {product.price && (
                        <span className="font-sans text-sm text-white/80">
                          {product.price}
                        </span>
                      )}
                    </div>

                    {/* Quick actions */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 translate-x-4 group-hover:translate-x-0 transition-all duration-500 delay-100">
                      <button
                        className="w-10 h-10 bg-paper/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-paper transition-colors"
                        aria-label="Thêm vào yêu thích"
                      >
                        <svg
                          className="w-5 h-5 text-ink"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>
                      <button
                        className="w-10 h-10 bg-paper/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-paper transition-colors"
                        aria-label="Xem nhanh"
                      >
                        <svg
                          className="w-5 h-5 text-ink"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>

        {/* View All CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <Link
            href="/vn/store"
            className="group inline-flex items-center gap-3 font-sans text-sm tracking-[0.15em] uppercase text-ink hover:text-silk-gold transition-colors"
          >
            <span>Xem Tất Cả Bộ Sưu Tập</span>
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
          </Link>
        </motion.div>
      </div>
    </section>
  )
}
