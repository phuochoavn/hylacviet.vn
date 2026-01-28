'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

// ============================================
// DYNAMIC IMPORTS - Performance Optimized
// ============================================

// Critical path - Load immediately for hero
const SmoothScrollProvider = dynamic(
  () => import('@/components/providers/SmoothScrollProvider'),
  { ssr: false }
)

// Hero section - Priority loading
const KenBurnsHero = dynamic(
  () => import('@/components/sections/KenBurnsHero'),
  { ssr: false }
)

// Secondary sections - Load as user scrolls
const StickyScrollStory = dynamic(
  () => import('@/components/sections/StickyScrollStory'),
  { ssr: false }
)

const HorizontalScroll = dynamic(
  () => import('@/components/sections/HorizontalScroll'),
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

// ============================================
// LOADING SKELETONS - Premium Loading States
// ============================================

function HeroSkeleton() {
  return (
    <div className="relative h-screen w-full bg-ink animate-pulse">
      <div className="absolute inset-0 bg-gradient-to-b from-ink/50 to-ink" />
      <div className="absolute bottom-20 left-6 md:left-12 lg:left-20">
        <div className="h-16 w-48 bg-paper/10 mb-4 rounded" />
        <div className="h-16 w-32 bg-silk-gold/20 rounded" />
        <div className="h-6 w-64 bg-paper/5 mt-8 rounded" />
      </div>
    </div>
  )
}

function SectionSkeleton() {
  return (
    <div className="min-h-screen bg-paper flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-ink/10 border-t-silk-gold rounded-full animate-spin mx-auto" />
        <p className="mt-4 font-sans text-sm text-ink-muted tracking-wider">Loading...</p>
      </div>
    </div>
  )
}

function ProductGridSkeleton() {
  return (
    <section className="py-20 bg-paper">
      <div className="container mx-auto px-6">
        <div className="h-8 w-48 bg-ink/5 mb-12 rounded" />
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="aspect-portrait bg-ink/5 rounded animate-pulse" />
          ))}
        </div>
      </div>
    </section>
  )
}

// ============================================
// INTERFACES
// ============================================

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

// ============================================
// CONTACT SECTION - Call to Action
// ============================================

function ContactSection() {
  return (
    <section className="relative py-24 md:py-32 lg:py-40 bg-ink text-paper overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-[0.02]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Decorative element */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <span className="w-16 h-px bg-gradient-to-r from-transparent to-silk-gold" />
            <span className="text-silk-gold text-2xl">✦</span>
            <span className="w-16 h-px bg-gradient-to-l from-transparent to-silk-gold" />
          </div>

          <h2 className="font-display text-fluid-5xl md:text-fluid-6xl mb-6 leading-tight">
            Bắt đầu hành trình <br />
            <span className="italic text-silk-gold">của riêng bạn</span>
          </h2>

          <p className="font-serif text-paper/70 text-fluid-lg md:text-fluid-xl mb-12 leading-relaxed max-w-2xl mx-auto">
            Mỗi chiếc áo dài Mai Đỏ được may đo riêng,
            phù hợp với vóc dáng và câu chuyện của bạn.
            Hãy để chúng tôi đồng hành cùng bạn.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/vn/store"
              className="group relative inline-flex items-center justify-center px-10 py-5 bg-paper text-ink font-sans text-sm tracking-[0.2em] uppercase overflow-hidden transition-colors hover:text-paper"
              data-cursor
              data-cursor-text="Xem"
            >
              <span className="absolute inset-0 bg-silk-gold scale-x-0 group-hover:scale-x-100 origin-left transition-transform duration-500 ease-out" />
              <span className="relative z-10">Khám Phá Bộ Sưu Tập</span>
              <svg
                className="relative z-10 w-4 h-4 ml-3 transform group-hover:translate-x-1 transition-transform"
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
          <div className="mt-20 pt-12 border-t border-paper/10">
            <div className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16">
              <a
                href="tel:+84123456789"
                className="flex items-center gap-3 text-paper/60 hover:text-paper transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="font-sans text-sm">0123 456 789</span>
              </a>
              <a
                href="mailto:lienhe@maido.vn"
                className="flex items-center gap-3 text-paper/60 hover:text-paper transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="font-sans text-sm">lienhe@maido.vn</span>
              </a>
              <div className="flex items-center gap-3 text-paper/60">
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

      {/* Decorative bottom gradient */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-paper/20 to-transparent" />
    </section>
  )
}

// ============================================
// MAIN COMPONENT - Modern Zen Homepage
// ============================================

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
        {/* ============================================
            CHAPTER 1: THE AWAKENING
            Ken Burns Hero with video/slideshow
            ============================================ */}
        <Suspense fallback={<HeroSkeleton />}>
          <KenBurnsHero heroVideo={heroVideo} />
        </Suspense>

        {/* ============================================
            CHAPTER 2: THE JOURNEY
            Storytelling section with sticky images
            ============================================ */}
        <Suspense fallback={<SectionSkeleton />}>
          <StickyScrollStory />
        </Suspense>

        {/* ============================================
            CHAPTER 3: THE MASTERPIECE
            Featured product spotlight
            ============================================ */}
        {products.length > 0 && (
          <Suspense fallback={<SectionSkeleton />}>
            <SpotlightShowcase product={products[0]} />
          </Suspense>
        )}

        {/* ============================================
            CHAPTER 4: THE GALLERY
            Horizontal scroll collection browse
            ============================================ */}
        <Suspense fallback={<SectionSkeleton />}>
          <HorizontalScroll
            title="Khám Phá Bộ Sưu Tập"
            subtitle="Cuộn để khám phá"
          />
        </Suspense>

        {/* ============================================
            CHAPTER 5: THE COLLECTION
            Product grid with bento layout
            ============================================ */}
        <Suspense fallback={<ProductGridSkeleton />}>
          <CollectionPreview
            title="Sản Phẩm Nổi Bật"
            subtitle="Mỗi tác phẩm là một hành trình của vẻ đẹp"
            products={products.length > 0 ? products : undefined}
          />
        </Suspense>

        {/* ============================================
            CHAPTER 6: THE TRUST
            Social proof and testimonials
            ============================================ */}
        <Suspense fallback={<SectionSkeleton />}>
          <TrustSection />
        </Suspense>

        {/* ============================================
            CHAPTER 7: THE INVITATION
            Call to action
            ============================================ */}
        <ContactSection />
      </main>
    </SmoothScrollProvider>
  )
}
