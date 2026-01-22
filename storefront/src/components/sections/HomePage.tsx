'use client'

import dynamic from 'next/dynamic'
import SmoothScrollProvider from '../providers/SmoothScrollProvider'

// Dynamic imports for better performance
const HeroSection = dynamic(() => import('./HeroSection'), { ssr: false })
const CollectionPreview = dynamic(() => import('./CollectionPreview'))
const StorySection = dynamic(() => import('./StorySection'))

export default function HomePage() {
  return (
    <SmoothScrollProvider>
      <main className="relative">
        {/* Chapter 1: The Awakening */}
        <HeroSection 
          brandName="Mai Đo"
          slogan="Di sản trong hơi thở mới"
        />
        
        {/* Chapter 2: The Promenade */}
        <CollectionPreview 
          title="Bộ Sưu Tập"
          subtitle="Mỗi tác phẩm là một câu chuyện về di sản và sự tinh tế"
        />
        
        {/* Story Section */}
        <StorySection />
        
        {/* More sections can be added here */}
      </main>
    </SmoothScrollProvider>
  )
}
