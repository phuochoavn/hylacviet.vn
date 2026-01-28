import { Metadata } from "next"
import { Suspense } from "react"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import { getWebConfig } from "@lib/data/cms"
import ModernZenHome from "./modern-zen-home"

// ============================================
// METADATA - SEO Optimized
// ============================================

export async function generateMetadata(): Promise<Metadata> {
  const webConfig = await getWebConfig()

  const title = webConfig?.siteName || "Mai Đỏ | Áo Dài Việt Nam - Di sản trong hơi thở mới"
  const description = webConfig?.description || "Mai Đỏ - Thương hiệu áo dài cao cấp với thiết kế độc đáo, kết hợp tinh hoa truyền thống và phong cách đương đại. Đặt may áo dài cưới, áo dài lụa, áo dài gấm."

  return {
    title,
    description,
    keywords: webConfig?.keywords || [
      "áo dài",
      "áo dài cưới",
      "áo dài việt nam",
      "may áo dài",
      "Mai Đỏ",
      "ao dai",
      "vietnamese dress",
      "traditional dress",
      "luxury ao dai",
    ],
    authors: [{ name: "Mai Đỏ" }],
    creator: "Mai Đỏ",
    publisher: "Mai Đỏ",
    openGraph: {
      title,
      description,
      type: "website",
      locale: "vi_VN",
      siteName: "Mai Đỏ",
      images: webConfig?.thumbnail ? [
        {
          url: webConfig.thumbnail,
          width: 1200,
          height: 630,
          alt: "Mai Đỏ - Áo Dài Việt Nam",
        }
      ] : undefined
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: webConfig?.thumbnail ? [webConfig.thumbnail] : undefined,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  }
}

// ============================================
// LOADING SKELETON
// ============================================

function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-ink">
      <div className="h-screen w-full animate-pulse bg-gradient-to-b from-ink/50 to-ink" />
    </div>
  )
}

// ============================================
// DATA FETCHING HELPERS
// ============================================

async function getHomePageData(countryCode: string) {
  const [region, webConfig, collectionsData, productsData] = await Promise.all([
    getRegion(countryCode),
    getWebConfig(),
    listCollections({ fields: "id, handle, title" }).catch(() => ({ collections: [] })),
    listProducts({
      pageParam: 0,
      queryParams: { limit: 12 },
      countryCode,
    }).catch(() => ({ response: { products: [] } })),
  ])

  return {
    region,
    webConfig,
    collections: collectionsData.collections || [],
    products: productsData.response?.products || [],
  }
}

// ============================================
// PRODUCT TRANSFORMER
// ============================================

function transformProducts(products: any[]) {
  return products.map((product: any) => ({
    id: product.id,
    title: product.title,
    handle: product.handle,
    thumbnail: product.thumbnail,
    images: product.images,
    description: product.description,
    price: product.price?.calculated_price
      ? `${new Intl.NumberFormat('vi-VN').format(product.price.calculated_price)}₫`
      : undefined,
  }))
}

// ============================================
// PAGE COMPONENT - Server Component with Streaming
// ============================================

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  // Fetch all data in parallel
  const { region, webConfig, collections, products } = await getHomePageData(countryCode)

  // Return null if region not found
  if (!region) {
    return null
  }

  // Transform products for the Modern Zen components
  const transformedProducts = transformProducts(products)

  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <ModernZenHome
        products={transformedProducts}
        collections={collections}
        countryCode={countryCode}
        heroImage={webConfig?.thumbnail}
        heroVideo={webConfig?.heroVideo}
      />
    </Suspense>
  )
}
