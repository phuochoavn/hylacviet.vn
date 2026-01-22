'use client'

import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'

interface Product {
  id: string
  title: string
  handle: string
  thumbnail?: string
  price?: string
}

interface CollectionPreviewProps {
  title?: string
  subtitle?: string
  products?: Product[]
}

const placeholderProducts: Product[] = [
  { id: '1', title: 'Áo Dài Cưới Truyền Thống', handle: 'ao-dai-cuoi', price: '12.500.000₫' },
  { id: '2', title: 'Áo Dài Gấm Hoàng Gia', handle: 'ao-dai-gam', price: '8.900.000₫' },
  { id: '3', title: 'Áo Dài Lụa Tơ Tằm', handle: 'ao-dai-lua', price: '6.500.000₫' },
  { id: '4', title: 'Áo Dài Thêu Tay Sen', handle: 'ao-dai-sen', price: '15.000.000₫' },
  { id: '5', title: 'Áo Dài Cách Tân', handle: 'ao-dai-cach-tan', price: '4.500.000₫' },
]

export default function CollectionPreview({
  title = "Bộ Sưu Tập",
  subtitle = "Mỗi tác phẩm là một câu chuyện về di sản và sự tinh tế",
  products = placeholderProducts
}: CollectionPreviewProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: true, margin: "-100px" })

  return (
    <section 
      ref={containerRef}
      className="relative min-h-screen bg-paper-warm py-20 md:py-32 overflow-hidden"
    >
      {/* Section Header */}
      <div className="container mx-auto px-6 mb-16 md:mb-24">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="max-w-2xl"
        >
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-ink mb-6">
            {title}
          </h2>
          <p className="font-serif text-ink-light text-lg md:text-xl italic">
            {subtitle}
          </p>
        </motion.div>
      </div>

      {/* Horizontal Scroll Gallery */}
      <div className="horizontal-scroll px-6 gap-8 md:gap-12 pb-8">
        <div className="w-[10vw] flex-shrink-0" />
        
        {products.map((product, index) => (
          <ProductCard 
            key={product.id} 
            product={product} 
            index={index}
            isInView={isInView}
          />
        ))}
        
        {/* View All Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="flex-shrink-0 w-[280px] md:w-[320px] flex items-center justify-center"
        >
          <Link 
            href="/vn/store"
            className="group flex flex-col items-center gap-4 p-8 border border-ink/10 rounded-lg hover:border-ink/30 transition-colors duration-500"
          >
            <div className="w-16 h-16 rounded-full border border-ink/20 flex items-center justify-center group-hover:bg-ink group-hover:border-ink transition-all duration-500">
              <svg 
                className="w-6 h-6 text-ink group-hover:text-paper transition-colors duration-500" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
            <span className="font-sans text-sm tracking-widest uppercase text-ink-light group-hover:text-ink transition-colors duration-500">
              Xem tất cả
            </span>
          </Link>
        </motion.div>
        
        <div className="w-[10vw] flex-shrink-0" />
      </div>

      {/* Scroll hint */}
      <div className="container mx-auto px-6 mt-8">
        <p className="text-ink-muted text-xs tracking-widest uppercase flex items-center gap-3">
          <span className="w-8 h-px bg-ink-muted" />
          Kéo ngang để xem thêm
        </p>
      </div>
    </section>
  )
}

function ProductCard({ product, index, isInView }: { product: Product; index: number; isInView: boolean }) {
  const [isHovered, setIsHovered] = useState(false)
  
  const heights = ['h-[400px]', 'h-[450px]', 'h-[380px]', 'h-[420px]', 'h-[440px]']
  const height = heights[index % heights.length]
  
  const offsets = ['mt-0', 'mt-12', 'mt-4', 'mt-16', 'mt-8']
  const offset = offsets[index % offsets.length]

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: 0.8, 
        delay: index * 0.1,
        ease: [0.25, 0.46, 0.45, 0.94]
      }}
      className={`flex-shrink-0 w-[280px] md:w-[320px] lg:w-[360px] ${offset}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/vn/products/${product.handle}`} className="block group">
        <div className={`relative ${height} overflow-hidden bg-paper mb-6`}>
          <div className="absolute inset-0 bg-gradient-to-br from-silk-pearl to-paper-warm" />
          
          {product.thumbnail && (
            <Image
              src={product.thumbnail}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
          )}
          
          <motion.div 
            className="absolute inset-0 bg-ink/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            transition={{ duration: 0.4 }}
          />
          
          <div className="absolute inset-4 border border-paper/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
        
        <div className="space-y-2">
          <h3 className="font-serif text-xl text-ink group-hover:text-ink-midnight transition-colors duration-300">
            {product.title}
          </h3>
          {product.price && (
            <p className="font-sans text-sm text-ink-light tracking-wide">
              {product.price}
            </p>
          )}
        </div>
        
        <div className="mt-4 h-px bg-ink/10 relative overflow-hidden">
          <motion.div 
            className="absolute inset-y-0 left-0 bg-ink"
            initial={{ width: '0%' }}
            animate={{ width: isHovered ? '100%' : '0%' }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          />
        </div>
      </Link>
    </motion.div>
  )
}
