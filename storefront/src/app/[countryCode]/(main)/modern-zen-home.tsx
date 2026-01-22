'use client'

import dynamic from 'next/dynamic'

// Dynamic imports for better performance
const SmoothScrollProvider = dynamic(
  () => import('@/components/providers/SmoothScrollProvider'),
  { ssr: false }
)
const HeroSection = dynamic(
  () => import('@/components/sections/HeroSection'),
  { 
    ssr: false,
    loading: () => (
      <div className="h-screen bg-paper flex items-center justify-center">
        <div className="animate-pulse text-ink-light">Đang tải...</div>
      </div>
    )
  }
)
const CollectionPreview = dynamic(
  () => import('@/components/sections/CollectionPreview'),
  { ssr: true }
)
const StorySection = dynamic(
  () => import('@/components/sections/StorySection'),
  { ssr: true }
)

interface Product {
  id: string
  title: string
  handle: string
  thumbnail?: string
  price?: string
}

interface Collection {
  id: string
  handle: string
  title: string
}

interface ModernZenHomeProps {
  products: Product[]
  collections: Collection[]
  countryCode: string
}

export default function ModernZenHome({ 
  products, 
  collections,
  countryCode 
}: ModernZenHomeProps) {
  return (
    <SmoothScrollProvider>
      <main className="relative bg-paper">
        {/* Chapter 1: The Awakening - Hero với 3D Silk */}
        <HeroSection 
          brandName="Mai Đo"
          slogan="Di sản trong hơi thở mới"
        />
        
        {/* Chapter 2: The Promenade - Horizontal scroll products */}
        <CollectionPreview 
          title="Bộ Sưu Tập"
          subtitle="Mỗi tác phẩm là một câu chuyện về di sản và sự tinh tế"
          products={products.length > 0 ? products : undefined}
        />
        
        {/* Story Section */}
        <StorySection />
        
        {/* Contact/CTA Section */}
        <ContactSection />
      </main>
    </SmoothScrollProvider>
  )
}

// Contact Section Component
function ContactSection() {
  return (
    <section className="relative py-24 md:py-32 bg-ink text-paper overflow-hidden">
      {/* Background texture */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,...')] bg-repeat" />
      </div>
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-display text-3xl md:text-4xl lg:text-5xl mb-6">
            Bắt đầu hành trình <br />
            <span className="italic">của riêng bạn</span>
          </h2>
          
          <p className="font-serif text-paper/70 text-lg md:text-xl mb-10 leading-relaxed">
            Mỗi chiếc áo dài Mai Đo được may đo riêng, 
            phù hợp với vóc dáng và câu chuyện của bạn.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/vn/store"
              className="inline-flex items-center justify-center px-8 py-4 bg-paper text-ink font-sans text-sm tracking-widest uppercase hover:bg-silk-pearl transition-colors duration-300"
            >
              Khám phá bộ sưu tập
            </a>
            <a 
              href="/vn/contact"
              className="inline-flex items-center justify-center px-8 py-4 border border-paper/30 text-paper font-sans text-sm tracking-widest uppercase hover:bg-paper/10 transition-colors duration-300"
            >
              Đặt lịch tư vấn
            </a>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-paper/20 to-transparent" />
    </section>
  )
}
