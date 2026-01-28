"use client"

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion"
import { useRef, ReactNode, MouseEvent } from "react"
import Link from "next/link"

interface MagneticButtonProps {
    children: ReactNode
    className?: string
    href?: string
    onClick?: () => void
    strength?: number
    variant?: "primary" | "secondary" | "ghost"
    size?: "sm" | "md" | "lg"
    cursorText?: string
}

export default function MagneticButton({
    children,
    className = "",
    href,
    onClick,
    strength = 0.3,
    variant = "primary",
    size = "md",
    cursorText,
}: MagneticButtonProps) {
    const ref = useRef<HTMLDivElement>(null)

    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const springConfig = { damping: 15, stiffness: 150 }
    const xSpring = useSpring(x, springConfig)
    const ySpring = useSpring(y, springConfig)

    const handleMouseMove = (e: MouseEvent) => {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        const deltaX = (e.clientX - centerX) * strength
        const deltaY = (e.clientY - centerY) * strength

        x.set(deltaX)
        y.set(deltaY)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    // Size classes
    const sizeClasses = {
        sm: "px-5 py-2.5 text-xs",
        md: "px-8 py-4 text-sm",
        lg: "px-12 py-5 text-base",
    }

    // Variant classes
    const variantClasses = {
        primary:
            "bg-ink text-paper hover:bg-ink/90 border border-transparent",
        secondary:
            "bg-transparent text-ink border border-ink hover:bg-ink hover:text-paper",
        ghost:
            "bg-transparent text-ink border-none hover:bg-ink/5",
    }

    const buttonClasses = `
    relative inline-flex items-center justify-center gap-3
    font-sans tracking-[0.15em] uppercase
    transition-colors duration-300
    overflow-hidden
    ${sizeClasses[size]}
    ${variantClasses[variant]}
    ${className}
  `

    const content = (
        <motion.div
            ref={ref}
            className={buttonClasses}
            style={{ x: xSpring, y: ySpring }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            whileTap={{ scale: 0.98 }}
            data-cursor
            data-cursor-text={cursorText}
        >
            {/* Hover background animation */}
            <motion.span
                className="absolute inset-0 bg-silk-gold origin-left pointer-events-none"
                initial={{ scaleX: 0 }}
                whileHover={{ scaleX: 1 }}
                transition={{ duration: 0.4, ease: "easeInOut" }}
            />

            {/* Content */}
            <span className="relative z-10 flex items-center gap-3">
                {children}
            </span>
        </motion.div>
    )

    if (href) {
        return <Link href={href}>{content}</Link>
    }

    return (
        <button onClick={onClick} className="inline-block">
            {content}
        </button>
    )
}

// Simple magnetic wrapper
interface MagneticWrapperProps {
    children: ReactNode
    strength?: number
}

export function MagneticWrapper({ children, strength = 0.3 }: MagneticWrapperProps) {
    const ref = useRef<HTMLDivElement>(null)

    const x = useMotionValue(0)
    const y = useMotionValue(0)

    const springConfig = { damping: 15, stiffness: 150 }
    const xSpring = useSpring(x, springConfig)
    const ySpring = useSpring(y, springConfig)

    const handleMouseMove = (e: MouseEvent) => {
        if (!ref.current) return

        const rect = ref.current.getBoundingClientRect()
        const centerX = rect.left + rect.width / 2
        const centerY = rect.top + rect.height / 2

        x.set((e.clientX - centerX) * strength)
        y.set((e.clientY - centerY) * strength)
    }

    const handleMouseLeave = () => {
        x.set(0)
        y.set(0)
    }

    return (
        <motion.div
            ref={ref}
            style={{ x: xSpring, y: ySpring }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className="inline-block"
        >
            {children}
        </motion.div>
    )
}
