import { Metadata } from "next"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import { getWebConfig } from "@lib/data/cms"
import ModernZenHome from "./modern-zen-home"

export async function generateMetadata(): Promise<Metadata> {
  const webConfig = await getWebConfig()

  const title = webConfig?.siteName || "Mai Đo | Áo Dài Việt Nam - Di sản trong hơi thở mới"
  const description = webConfig?.description || "Mai Đo - Thương hiệu áo dài cao cấp với thiết kế độc đáo, kết hợp tinh hoa truyền thống và phong cách đương đại. Đặt may áo dài cưới, áo dài lụa, áo dài gấm."

  return {
    title,
    description,
    keywords: webConfig?.keywords || ["áo dài", "áo dài cưới", "áo dài việt nam", "may áo dài", "Mai Đo"],
    openGraph: {
      title,
      description,
      type: "website",
      images: webConfig?.thumbnail ? [webConfig.thumbnail] : undefined
    },
  }
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)
  const webConfig = await getWebConfig()

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  // Fetch featured products
  let featuredProducts: any[] = []
  try {
    const { response: { products } } = await listProducts({
      pageParam: 0,
      queryParams: {
        limit: 10,
      },
      countryCode,
    })
    featuredProducts = products || []
  } catch (error) {
    console.error("Error fetching products:", error)
  }

  if (!region) {
    return null
  }

  // Transform products for the Modern Zen components
  const transformedProducts = featuredProducts.map((product: any) => ({
    id: product.id,
    title: product.title,
    handle: product.handle,
    thumbnail: product.thumbnail,
    images: product.images,
    price: product.price?.calculated_price
      ? `${new Intl.NumberFormat('vi-VN').format(product.price.calculated_price)}₫`
      : undefined,
  }))

  return (
    <ModernZenHome
      products={transformedProducts}
      collections={collections || []}
      countryCode={countryCode}
      heroImage={webConfig?.thumbnail}
    />
  )
}
