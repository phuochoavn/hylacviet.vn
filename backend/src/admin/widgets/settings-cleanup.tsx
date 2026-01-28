/**
 * Settings Cleanup Widget - "Digital Atelier" Mode
 * 
 * This widget is specifically for the Settings page to ensure CSS is injected
 * even if the user navigates directly to Settings without going through Orders.
 * 
 * It uses the same CSS as the main sidebar cleanup widget.
 */

import { defineWidgetConfig } from "@medusajs/admin-sdk"
import { useEffect } from "react"

const CLEANUP_STYLES = `
/* ============================================= */
/* Sidebar Cleanup for Mai Đo Digital Atelier   */
/* ============================================= */

/* --------------------------------------------- */
/* Main Sidebar: Hide Advanced Items             */
/* --------------------------------------------- */
a[href="/app/inventory"],
a[href="/app/promotions"],
a[href="/app/price-lists"],
a[href="/app/collections"],
a[href="/app/categories"] {
    display: none !important;
}

/* --------------------------------------------- */
/* Settings Page: Hide Technical Items           */
/* These selectors target the inner Settings nav */
/* --------------------------------------------- */

/* Hide entire list items in Settings menu */
a[href="/app/settings/store"],
a[href="/app/settings/users"],
a[href="/app/settings/regions"],
a[href="/app/settings/tax-regions"],
a[href="/app/settings/return-reasons"],
a[href="/app/settings/refund-reasons"],
a[href="/app/settings/sales-channels"],
a[href="/app/settings/product-types"],
a[href="/app/settings/product-tags"],
a[href="/app/settings/locations"],
a[href="/app/settings/publishable-api-keys"],
a[href="/app/settings/secret-api-keys"],
a[href="/app/settings/workflows"] {
    display: none !important;
}

/* Also hide their parent containers if they exist */
nav a[href="/app/settings/store"],
nav a[href="/app/settings/users"],
nav a[href="/app/settings/regions"],
nav a[href="/app/settings/tax-regions"],
nav a[href="/app/settings/return-reasons"],
nav a[href="/app/settings/refund-reasons"],
nav a[href="/app/settings/sales-channels"],
nav a[href="/app/settings/product-types"],
nav a[href="/app/settings/product-tags"],
nav a[href="/app/settings/locations"],
nav a[href="/app/settings/publishable-api-keys"],
nav a[href="/app/settings/secret-api-keys"],
nav a[href="/app/settings/workflows"] {
    display: none !important;
}

/* --------------------------------------------- */
/* Fallback: Hide Gift Cards if it ever appears */
/* --------------------------------------------- */
a[href="/app/gift-cards"] {
    display: none !important;
}
`

const SettingsCleanupWidget = () => {
    useEffect(() => {
        // Check if styles are already injected (avoid duplicates)
        const existingStyle = document.getElementById("maido-admin-cleanup-styles")
        if (existingStyle) {
            return // Already injected, skip
        }

        // Create and inject the style element
        const styleEl = document.createElement("style")
        styleEl.id = "maido-admin-cleanup-styles"
        styleEl.textContent = CLEANUP_STYLES
        document.head.appendChild(styleEl)

        // DO NOT cleanup on unmount - we want the styles to persist
        // across all pages in the SPA
    }, [])

    // This widget renders nothing, it only injects CSS
    return null
}

export const config = defineWidgetConfig({
    // This zone is displayed on product detail page
    // Combined with order.list.before, we cover most entry points
    zone: "product.details.before",
})

export default SettingsCleanupWidget
