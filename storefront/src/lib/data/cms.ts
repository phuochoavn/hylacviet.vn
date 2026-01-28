"use server"

import { sdk } from "@lib/config"

export type WebConfig = {
    thumbnail: string | null
    logo: string | null
    siteName: string | null
    description: string | null
    keywords: string[] | null
}

/**
 * Fetches the specific "Web Configuration" product used for global settings
 * like Hero Image, Logo, etc.
 */
export const getWebConfig = async (): Promise<WebConfig | null> => {
    try {
        const { products } = await sdk.store.product.list(
            {
                handle: "web-config",
                fields: "*images,*variants,*metadata"
            },
            { next: { tags: ['web-config'] } }
        )

        const product = products[0]

        if (!product) return null

        // Logic: 
        // - Thumbnail -> Hero Image
        // - First Image (images[0]) -> Logo (if exists)
        // - Metadata -> SEO

        const logoUrl = product.images && product.images.length > 0 ? product.images[0].url : null

        return {
            thumbnail: product.thumbnail || null,
            logo: logoUrl,
            siteName: (product.metadata?.site_name as string) || null,
            description: (product.metadata?.description as string) || null,
            keywords: (product.metadata?.keywords as string)?.split(",").map(k => k.trim()) || null
        }
    } catch (error) {
        console.error("Failed to fetch web content configuration:", error)
        return null
    }
}
