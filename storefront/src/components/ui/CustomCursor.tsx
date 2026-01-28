"use client"

import { useEffect, useState, useCallback } from "react"
import { motion, useMotionValue, useSpring, AnimatePresence } from "framer-motion"

export default function CustomCursor() {
    const [isVisible, setIsVisible] = useState(false)
    const [isHovering, setIsHovering] = useState(false)
    const [isClicking, setIsClicking] = useState(false)
    const [hoverText, setHoverText] = useState("")
    const [isMobile, setIsMobile] = useState(true)

    const cursorX = useMotionValue(-100)
    const cursorY = useMotionValue(-100)

    const springConfig = { damping: 25, stiffness: 400 }
    const cursorXSpring = useSpring(cursorX, springConfig)
    const cursorYSpring = useSpring(cursorY, springConfig)

    // Check for mobile device
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.matchMedia("(max-width: 1024px)").matches ||
                "ontouchstart" in window)
        }
        checkMobile()
        window.addEventListener("resize", checkMobile)
        return () => window.removeEventListener("resize", checkMobile)
    }, [])

    // Mouse move handler
    const moveCursor = useCallback((e: MouseEvent) => {
        cursorX.set(e.clientX)
        cursorY.set(e.clientY)
        if (!isVisible) setIsVisible(true)
    }, [cursorX, cursorY, isVisible])

    // Mouse enter/leave document
    useEffect(() => {
        if (isMobile) return

        const handleMouseEnter = () => setIsVisible(true)
        const handleMouseLeave = () => setIsVisible(false)
        const handleMouseDown = () => setIsClicking(true)
        const handleMouseUp = () => setIsClicking(false)

        document.addEventListener("mousemove", moveCursor)
        document.addEventListener("mouseenter", handleMouseEnter)
        document.addEventListener("mouseleave", handleMouseLeave)
        document.addEventListener("mousedown", handleMouseDown)
        document.addEventListener("mouseup", handleMouseUp)

        return () => {
            document.removeEventListener("mousemove", moveCursor)
            document.removeEventListener("mouseenter", handleMouseEnter)
            document.removeEventListener("mouseleave", handleMouseLeave)
            document.removeEventListener("mousedown", handleMouseDown)
            document.removeEventListener("mouseup", handleMouseUp)
        }
    }, [moveCursor, isMobile])

    // Hover detection for interactive elements
    useEffect(() => {
        if (isMobile) return

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const interactive = target.closest("a, button, [data-cursor], [data-cursor-text]")

            if (interactive) {
                setIsHovering(true)
                const cursorText = interactive.getAttribute("data-cursor-text")
                if (cursorText) setHoverText(cursorText)
            }
        }

        const handleMouseOut = (e: MouseEvent) => {
            const target = e.target as HTMLElement
            const interactive = target.closest("a, button, [data-cursor], [data-cursor-text]")
            if (interactive) {
                setIsHovering(false)
                setHoverText("")
            }
        }

        document.addEventListener("mouseover", handleMouseOver)
        document.addEventListener("mouseout", handleMouseOut)

        return () => {
            document.removeEventListener("mouseover", handleMouseOver)
            document.removeEventListener("mouseout", handleMouseOut)
        }
    }, [isMobile])

    // Don't render on mobile
    if (isMobile) return null

    return (
        <>
            {/* Hide default cursor globally */}
            <style jsx global>{`
        * {
          cursor: none !important;
        }
        @media (max-width: 1024px) {
          * {
            cursor: auto !important;
          }
        }
      `}</style>

            {/* Main cursor dot */}
            <motion.div
                className="fixed top-0 left-0 z-[9999] pointer-events-none mix-blend-difference"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
            >
                <motion.div
                    className="relative flex items-center justify-center"
                    animate={{
                        scale: isClicking ? 0.8 : isHovering ? 2.5 : 1,
                    }}
                    transition={{ duration: 0.15 }}
                >
                    {/* Inner dot */}
                    <motion.div
                        className="absolute w-3 h-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white"
                        animate={{
                            scale: isHovering ? 0.5 : 1,
                        }}
                    />

                    {/* Outer ring */}
                    <motion.div
                        className="absolute w-10 h-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-white/50"
                        animate={{
                            scale: isHovering ? 1.2 : 1,
                            opacity: isHovering ? 1 : 0.5,
                        }}
                    />

                    {/* Hover text */}
                    <AnimatePresence>
                        {hoverText && (
                            <motion.span
                                className="absolute whitespace-nowrap text-white text-xs font-sans tracking-widest uppercase"
                                style={{
                                    transform: "translate(-50%, 30px)",
                                }}
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                            >
                                {hoverText}
                            </motion.span>
                        )}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </>
    )
}
