"use client"

import { motion, useInView } from "framer-motion"
import { useRef } from "react"

interface TextRevealProps {
    children: string
    className?: string
    delay?: number
    duration?: number
    staggerChildren?: number
    as?: "h1" | "h2" | "h3" | "h4" | "p" | "span"
}

export default function TextReveal({
    children,
    className = "",
    delay = 0,
    duration = 0.8,
    staggerChildren = 0.02,
    as: Component = "span",
}: TextRevealProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-10%" })

    // Split text into words
    const words = children.split(" ")

    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren,
                delayChildren: delay,
            },
        },
    }

    const wordVariants = {
        hidden: {
            y: "100%",
            opacity: 0,
        },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                duration,
                ease: [0.25, 0.46, 0.45, 0.94],
            },
        },
    }

    return (
        <motion.div
            ref={ref}
            className={className}
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            <Component className="inline">
                {words.map((word, index) => (
                    <span
                        key={index}
                        className="inline-block overflow-hidden"
                    >
                        <motion.span
                            className="inline-block"
                            variants={wordVariants}
                        >
                            {word}
                        </motion.span>
                        {index < words.length - 1 && (
                            <span className="inline-block">&nbsp;</span>
                        )}
                    </span>
                ))}
            </Component>
        </motion.div>
    )
}

// Character-by-character variant
interface CharRevealProps {
    children: string
    className?: string
    delay?: number
}

export function CharReveal({
    children,
    className = "",
    delay = 0,
}: CharRevealProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-10%" })

    const chars = children.split("")

    return (
        <motion.div
            ref={ref}
            className={className}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            {chars.map((char, index) => (
                <motion.span
                    key={index}
                    className="inline-block"
                    variants={{
                        hidden: { y: "100%", opacity: 0 },
                        visible: {
                            y: 0,
                            opacity: 1,
                            transition: {
                                duration: 0.5,
                                delay: delay + index * 0.03,
                                ease: [0.25, 0.46, 0.45, 0.94],
                            },
                        },
                    }}
                >
                    {char === " " ? "\u00A0" : char}
                </motion.span>
            ))}
        </motion.div>
    )
}

// Line reveal for paragraphs
interface LineRevealProps {
    children: string
    className?: string
    delay?: number
}

export function LineReveal({
    children,
    className = "",
    delay = 0,
}: LineRevealProps) {
    const ref = useRef<HTMLDivElement>(null)
    const isInView = useInView(ref, { once: true, margin: "-10%" })

    // Split by newlines or sentences
    const lines = children.split(/\n|(?<=[.!?])\s+/)

    return (
        <div ref={ref} className={className}>
            {lines.map((line, index) => (
                <div key={index} className="overflow-hidden">
                    <motion.div
                        initial={{ y: "100%" }}
                        animate={isInView ? { y: 0 } : { y: "100%" }}
                        transition={{
                            duration: 0.8,
                            delay: delay + index * 0.15,
                            ease: [0.25, 0.46, 0.45, 0.94],
                        }}
                    >
                        {line}
                    </motion.div>
                </div>
            ))}
        </div>
    )
}
