/**
 * Sidebar Cleanup Widget - "Digital Atelier" Mode
 * 
 * This widget injects CSS to hide advanced/technical sidebar items,
 * creating a simplified admin interface for the brand owner (Hân Hân).
 * 
 * Items hidden:
 * - Main: Inventory, Promotions, Price Lists
 * - Settings: Most technical items (API Keys, Regions, Tax, Workflows, etc.)
 * 
 * Items kept visible:
 * - Main: Home, Orders, Products, Customers, Collections, Categories
 * - Settings: Profile (user's own settings)
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
a[href="/app/price-lists"] {
    display: none !important;
}

/* --------------------------------------------- */
/* Settings Sidebar: Hide Technical Items        */
/* --------------------------------------------- */
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

/* --------------------------------------------- */
/* Fallback: Hide Gift Cards if it ever appears */
/* --------------------------------------------- */
a[href="/app/gift-cards"] {
    display: none !important;
}
`

const SidebarCleanupWidget = () => {
    useEffect(() => {
        // Check if styles are already injected
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
    // Using login.before ensures CSS is injected at the earliest possible point
    // This zone is rendered when the login page loads, before any navigation
    zone: "login.before",
})

export default SidebarCleanupWidget
