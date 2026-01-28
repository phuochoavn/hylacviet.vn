"use client"

import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { ReactNode, useEffect, useState } from "react"

interface PageTransitionProps {
    children: ReactNode
}

export default function PageTransition({ children }: PageTransitionProps) {
    const pathname = usePathname()
    const [isAnimating, setIsAnimating] = useState(false)

    useEffect(() => {
        setIsAnimating(true)
        const timer = setTimeout(() => setIsAnimating(false), 800)
        return () => clearTimeout(timer)
    }, [pathname])

    return (
        <>
            {/* Page transition overlay */}
            <AnimatePresence mode="wait">
                {isAnimating && (
                    <motion.div
                        key="page-transition"
                        className="fixed inset-0 z-[100] pointer-events-none"
                    >
                        {/* First slide - dark */}
                        <motion.div
                            className="absolute inset-0 bg-ink origin-left"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: [0, 1, 1, 0] }}
                            transition={{
                                duration: 0.8,
                                times: [0, 0.4, 0.6, 1],
                                ease: [0.76, 0, 0.24, 1],
                            }}
                        />

                        {/* Second slide - gold accent */}
                        <motion.div
                            className="absolute inset-0 bg-silk-gold origin-left"
                            initial={{ scaleX: 0 }}
                            animate={{ scaleX: [0, 1, 1, 0] }}
                            transition={{
                                duration: 0.8,
                                times: [0, 0.4, 0.6, 1],
                                ease: [0.76, 0, 0.24, 1],
                                delay: 0.05,
                            }}
                        />

                        {/* Brand logo in center */}
                        <motion.div
                            className="absolute inset-0 flex items-center justify-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: [0, 1, 1, 0] }}
                            transition={{
                                duration: 0.8,
                                times: [0, 0.35, 0.65, 1],
                            }}
                        >
                            <span className="font-display text-4xl text-paper tracking-widest">
                                MAI ĐỎ
                            </span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main content with fade */}
            <motion.div
                key={pathname}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                {children}
            </motion.div>
        </>
    )
}
