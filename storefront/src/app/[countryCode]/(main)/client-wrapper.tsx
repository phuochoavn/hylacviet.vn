"use client"

import { ReactNode } from "react"
import dynamic from "next/dynamic"

// Dynamic imports for client-side only components
const CustomCursor = dynamic(() => import("@/components/ui/CustomCursor"), {
    ssr: false,
})

const Preloader = dynamic(() => import("@/components/ui/Preloader"), {
    ssr: false,
})

const PageTransition = dynamic(() => import("@/components/ui/PageTransition"), {
    ssr: false,
})

interface ClientWrapperProps {
    children: ReactNode
}

export default function ClientWrapper({ children }: ClientWrapperProps) {
    return (
        <>
            {/* Custom Cursor - Desktop only */}
            <CustomCursor />

            {/* Preloader */}
            <Preloader />

            {/* Page Content */}
            <PageTransition>{children}</PageTransition>
        </>
    )
}
