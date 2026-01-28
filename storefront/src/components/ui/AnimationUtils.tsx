"use client"

import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import { useRef, ReactNode } from "react"

// Parallax wrapper - moves content based on scroll
interface ParallaxProps {
    children: ReactNode
    speed?: number
    className?: string
}

export function Parallax({ children, speed = 0.5, className = "" }: ParallaxProps) {
    const ref = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    })

    const y = useTransform(scrollYProgress, [0, 1], [-100 * speed, 100 * speed])
    const ySpring = useSpring(y, { stiffness: 100, damping: 30 })

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            <motion.div style={{ y: ySpring }}>{children}</motion.div>
        </div>
    )
}

// Fade in on scroll
interface FadeInProps {
    children: ReactNode
    className?: string
    delay?: number
    direction?: "up" | "down" | "left" | "right" | "none"
    distance?: number
}

export function FadeIn({
    children,
    className = "",
    delay = 0,
    direction = "up",
    distance = 50,
}: FadeInProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-10%" })

    const getInitialPosition = () => {
        switch (direction) {
            case "up":
                return { y: distance, x: 0 }
            case "down":
                return { y: -distance, x: 0 }
            case "left":
                return { x: distance, y: 0 }
            case "right":
                return { x: -distance, y: 0 }
            default:
                return { x: 0, y: 0 }
        }
    }

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, ...getInitialPosition() }}
            animate={isInView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{
                duration: 0.8,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
        >
            {children}
        </motion.div>
    )
}

// Scale in on scroll
interface ScaleInProps {
    children: ReactNode
    className?: string
    delay?: number
}

export function ScaleIn({ children, className = "", delay = 0 }: ScaleInProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-10%" })

    return (
        <motion.div
            ref={ref}
            className={className}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{
                duration: 0.6,
                delay,
                ease: [0.25, 0.46, 0.45, 0.94],
            }}
        >
            {children}
        </motion.div>
    )
}

// Stagger children
interface StaggerContainerProps {
    children: ReactNode
    className?: string
    staggerDelay?: number
    delayChildren?: number
}

export function StaggerContainer({
    children,
    className = "",
    staggerDelay = 0.1,
    delayChildren = 0,
}: StaggerContainerProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-10%" })

    return (
        <motion.div
            ref={ref}
            className={className}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
                hidden: {},
                visible: {
                    transition: {
                        staggerChildren: staggerDelay,
                        delayChildren,
                    },
                },
            }}
        >
            {children}
        </motion.div>
    )
}

export function StaggerItem({
    children,
    className = "",
}: {
    children: ReactNode
    className?: string
}) {
    return (
        <motion.div
            className={className}
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        duration: 0.6,
                        ease: [0.25, 0.46, 0.45, 0.94],
                    },
                },
            }}
        >
            {children}
        </motion.div>
    )
}

// Counter animation
interface CounterProps {
    value: number
    suffix?: string
    prefix?: string
    className?: string
    duration?: number
}

export function Counter({
    value,
    suffix = "",
    prefix = "",
    className = "",
    duration = 2,
}: CounterProps) {
    const ref = useRef<HTMLSpanElement>(null)
    const isInView = useInView(ref, { once: true })

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    })

    const count = useTransform(scrollYProgress, [0, 0.5], [0, value])
    const rounded = useSpring(count, { duration: duration * 1000 })

    return (
        <motion.span ref={ref} className={className}>
            {prefix}
            <motion.span>{isInView ? Math.round(rounded.get()) : 0}</motion.span>
            {suffix}
        </motion.span>
    )
}

// Reveal mask animation
interface RevealMaskProps {
    children: ReactNode
    className?: string
    delay?: number
    direction?: "left" | "right" | "top" | "bottom"
}

export function RevealMask({
    children,
    className = "",
    delay = 0,
    direction = "left",
}: RevealMaskProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-10%" })

    const origins: Record<string, string> = {
        left: "left",
        right: "right",
        top: "top",
        bottom: "bottom",
    }

    return (
        <div ref={ref} className={`relative overflow-hidden ${className}`}>
            {/* Content */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.01, delay: delay + 0.4 }}
            >
                {children}
            </motion.div>

            {/* Mask overlay */}
            <motion.div
                className="absolute inset-0 bg-silk-gold z-10"
                style={{ originX: direction === "left" ? 0 : direction === "right" ? 1 : 0.5 }}
                initial={{ scaleX: direction === "left" || direction === "right" ? 1 : 1, scaleY: 1 }}
                animate={
                    isInView
                        ? {
                            scaleX: direction === "left" || direction === "right" ? 0 : 1,
                            scaleY: direction === "top" || direction === "bottom" ? 0 : 1,
                        }
                        : {}
                }
                transition={{
                    duration: 0.8,
                    delay,
                    ease: [0.76, 0, 0.24, 1],
                }}
            />
        </div>
    )
}
