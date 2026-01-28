'use client'

import dynamic from 'next/dynamic'

// Dynamic imports for better performance
const SmoothScrollProvider = dynamic(
  () => import('@/components/providers/SmoothScrollProvider'),
  { ssr: false }
)
const CinematicHero = dynamic(
  () => import('@/components/sections/CinematicHero'),
  { ssr: false }
)
const SpotlightShowcase = dynamic(
  () => import('@/components/sections/SpotlightShowcase'),
  { ssr: true }
)
const CollectionPreview = dynamic(
  () => import('@/components/sections/CollectionPreview'),
  { ssr: true }
)
const TrustSection = dynamic(
  () => import('@/components/sections/TrustSection'),
  { ssr: true }
)
const HorizontalScroll = dynamic(
  () => import('@/components/sections/HorizontalScroll'),
  { ssr: false }
)

interface Product {
  id: string
  title: string
  handle: string
  thumbnail?: string
  images?: any[]
  price?: string
  description?: string
  calculated_price?: number
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
  heroImage?: string | null
  heroVideo?: string | null
}

export default function ModernZenHome({
  products,
  collections,
  countryCode,
  heroImage,
  heroVideo
}: ModernZenHomeProps) {
  return (
    <SmoothScrollProvider>
      <main className="relative bg-paper">
        {/* Chapter 1: The Awakening - Hero Section */}
        <CinematicHero heroImage={heroImage} heroVideo={heroVideo} />

        {/* Chapter 2: The Masterpiece - Featured Product Spotlight */}
        {products.length > 0 && <SpotlightShowcase product={products[0]} />}

        {/* Chapter 3: Horizontal Gallery - Immersive Collection Browse */}
        <HorizontalScroll
          title="Khám Phá Bộ Sưu Tập"
          subtitle="Cuộn để khám phá thêm"
        />

        {/* Chapter 4: The Promenade - Collection Gallery */}
        <CollectionPreview
          title="Sản Phẩm Nổi Bật"
          subtitle="Mỗi tác phẩm là một hành trình của vẻ đẹp"
          products={products.length > 0 ? products : undefined}
        />

        {/* Chapter 5: Trust & Social Proof */}
        <TrustSection />

        {/* Chapter 6: Call to Action (Contact Section) */}
        <ContactSection />
      </main>
    </SmoothScrollProvider>
  )
}

function ContactSection() {
  return (
    <section className="relative py-24 md:py-32 bg-ink text-paper overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          {/* Decorative element */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="w-12 h-px bg-silk-gold" />
            <span className="text-silk-gold">✦</span>
            <span className="w-12 h-px bg-silk-gold" />
          </div>

          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl mb-6 leading-tight">
            Bắt đầu hành trình <br />
            <span className="italic text-silk-gold">của riêng bạn</span>
          </h2>

          <p className="font-serif text-paper/70 text-lg md:text-xl mb-12 leading-relaxed max-w-2xl mx-auto">
            Mỗi chiếc áo dài Mai Đỏ được may đo riêng,
            phù hợp với vóc dáng và câu chuyện của bạn.
            Hãy để chúng tôi đồng hành cùng bạn.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/vn/store"
              className="group inline-flex items-center justify-center px-10 py-5 bg-paper text-ink font-sans text-sm tracking-[0.2em] uppercase hover:bg-silk-pearl transition-all duration-300"
              data-cursor
              data-cursor-text="Xem"
            >
              <span>Khám Phá Bộ Sưu Tập</span>
              <svg
                className="w-4 h-4 ml-3 transform group-hover:translate-x-1 transition-transform"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </a>
            <a
              href="tel:+84123456789"
              className="inline-flex items-center justify-center px-10 py-5 border border-paper/30 text-paper font-sans text-sm tracking-[0.2em] uppercase hover:bg-paper/10 hover:border-paper/60 transition-all duration-300"
              data-cursor
              data-cursor-text="Gọi"
            >
              Hotline: 0123.456.789
            </a>
          </div>

          {/* Contact Info */}
          <div className="mt-16 pt-12 border-t border-paper/10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-12">
              <a
                href="tel:+84123456789"
                className="flex items-center gap-3 text-paper/70 hover:text-paper transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-sans text-sm">0123 456 789</span>
              </a>
              <a
                href="mailto:lienhe@maido.vn"
                className="flex items-center gap-3 text-paper/70 hover:text-paper transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-sans text-sm">lienhe@maido.vn</span>
              </a>
              <div className="flex items-center gap-3 text-paper/70">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="font-sans text-sm">123 Nguyễn Huệ, Q1, HCM</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative bottom line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-paper/20 to-transparent" />
    </section>
  )
}
