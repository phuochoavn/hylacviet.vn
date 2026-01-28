"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

export default function Preloader() {
    const [isLoading, setIsLoading] = useState(true)
    const [progress, setProgress] = useState(0)

    useEffect(() => {
        // Simulate loading progress
        const interval = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(interval)
                    return 100
                }
                return prev + Math.random() * 15
            })
        }, 100)

        // Complete loading after content ready
        const handleLoad = () => {
            setProgress(100)
            setTimeout(() => setIsLoading(false), 500)
        }

        if (document.readyState === "complete") {
            handleLoad()
        } else {
            window.addEventListener("load", handleLoad)
        }

        // Fallback timeout
        const timeout = setTimeout(() => {
            setProgress(100)
            setTimeout(() => setIsLoading(false), 500)
        }, 3000)

        return () => {
            clearInterval(interval)
            clearTimeout(timeout)
            window.removeEventListener("load", handleLoad)
        }
    }, [])

    return (
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    className="fixed inset-0 z-[200] bg-paper flex flex-col items-center justify-center"
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                >
                    {/* Logo Animation */}
                    <motion.div
                        className="relative"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    >
                        {/* Brand Name */}
                        <div className="flex flex-col items-center">
                            <motion.span
                                className="font-display text-5xl md:text-6xl text-ink tracking-[0.3em]"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                MAI
                            </motion.span>
                            <motion.span
                                className="font-display text-5xl md:text-6xl text-silk-gold tracking-[0.3em]"
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                ĐỎ
                            </motion.span>
                        </div>

                        {/* Tagline */}
                        <motion.p
                            className="mt-4 font-serif text-ink-muted italic text-center"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                        >
                            Di sản trong hơi thở mới
                        </motion.p>
                    </motion.div>

                    {/* Progress Bar */}
                    <motion.div
                        className="absolute bottom-20 left-1/2 -translate-x-1/2 w-48"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <div className="h-px bg-ink/10 w-full overflow-hidden">
                            <motion.div
                                className="h-full bg-silk-gold origin-left"
                                style={{ scaleX: progress / 100 }}
                                transition={{ ease: "easeOut" }}
                            />
                        </div>
                        <motion.span
                            className="block mt-3 text-center font-sans text-xs tracking-[0.3em] text-ink-muted"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 1 }}
                        >
                            {Math.round(Math.min(progress, 100))}%
                        </motion.span>
                    </motion.div>

                    {/* Decorative corners */}
                    <div className="absolute top-8 left-8 w-12 h-12 border-l border-t border-ink/10" />
                    <div className="absolute top-8 right-8 w-12 h-12 border-r border-t border-ink/10" />
                    <div className="absolute bottom-8 left-8 w-12 h-12 border-l border-b border-ink/10" />
                    <div className="absolute bottom-8 right-8 w-12 h-12 border-r border-b border-ink/10" />
                </motion.div>
            )}
        </AnimatePresence>
    )
}
