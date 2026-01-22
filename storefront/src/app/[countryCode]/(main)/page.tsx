import { Metadata } from "next"
import { listCollections } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import ModernZenHome from "./modern-zen-home"

export const metadata: Metadata = {
  title: "Mai Đo | Áo Dài Việt Nam - Di sản trong hơi thở mới",
  description:
    "Mai Đo - Thương hiệu áo dài cao cấp với thiết kế độc đáo, kết hợp tinh hoa truyền thống và phong cách đương đại. Đặt may áo dài cưới, áo dài lụa, áo dài gấm.",
  keywords: ["áo dài", "áo dài cưới", "áo dài việt nam", "may áo dài", "Mai Đo"],
  openGraph: {
    title: "Mai Đo | Áo Dài Việt Nam",
    description: "Di sản trong hơi thở mới - Áo dài cao cấp thiết kế riêng",
    type: "website",
  },
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  
  const region = await getRegion(countryCode)
  
  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  // Fetch featured products
  let featuredProducts: any[] = []
  try {
    const { products } = await listProducts({
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
    price: product.price?.calculated_price 
      ? `${new Intl.NumberFormat('vi-VN').format(product.price.calculated_price)}₫`
      : undefined,
  }))

  return (
    <ModernZenHome 
      products={transformedProducts}
      collections={collections || []}
      countryCode={countryCode}
    />
  )
}
