"use client"

import { motion, useInView, useScroll, useTransform, MotionValue } from "framer-motion"
import { useRef, useMemo, ReactNode } from "react"

// =====================================================
// TEXT REVEAL - Word by Word with Masking
// =====================================================
interface TextRevealProps {
  children: string
  className?: string
  delay?: number
  duration?: number
  staggerChildren?: number
  as?: "h1" | "h2" | "h3" | "h4" | "p" | "span" | "div"
  once?: boolean
}

export default function TextReveal({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  staggerChildren = 0.03,
  as: Component = "span",
  once = true,
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: "-10%" })

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
      y: "110%",
      rotateX: -45,
      opacity: 0,
    },
    visible: {
      y: 0,
      rotateX: 0,
      opacity: 1,
      transition: {
        duration,
        ease: [0.215, 0.61, 0.355, 1], // easeOutCubic
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
      style={{ perspective: 1000 }}
    >
      <Component className="inline">
        {words.map((word, index) => (
          <span key={index} className="inline-block overflow-hidden">
            <motion.span
              className="inline-block origin-bottom"
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

// =====================================================
// CHAR REVEAL - Character by Character with Stagger
// =====================================================
interface CharRevealProps {
  children: string
  className?: string
  delay?: number
  charDelay?: number
  duration?: number
  once?: boolean
}

export function CharReveal({
  children,
  className = "",
  delay = 0,
  charDelay = 0.02,
  duration = 0.5,
  once = true,
}: CharRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: "-10%" })

  const chars = useMemo(() => children.split(""), [children])

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
          style={{ whiteSpace: char === " " ? "pre" : "normal" }}
          variants={{
            hidden: {
              y: "100%",
              opacity: 0,
              rotateX: -90,
            },
            visible: {
              y: 0,
              opacity: 1,
              rotateX: 0,
              transition: {
                duration,
                delay: delay + index * charDelay,
                ease: [0.215, 0.61, 0.355, 1],
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

// =====================================================
// LINE REVEAL - Line by Line with Mask Animation
// =====================================================
interface LineRevealProps {
  children: string | string[]
  className?: string
  lineClassName?: string
  delay?: number
  lineDelay?: number
  once?: boolean
}

export function LineReveal({
  children,
  className = "",
  lineClassName = "",
  delay = 0,
  lineDelay = 0.12,
  once = true,
}: LineRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: "-10%" })

  const lines = useMemo(() => {
    if (Array.isArray(children)) return children
    return children.split(/\n|(?<=[.!?])\s+/).filter(Boolean)
  }, [children])

  return (
    <div ref={ref} className={className}>
      {lines.map((line, index) => (
        <div key={index} className="overflow-hidden">
          <motion.div
            className={lineClassName}
            initial={{ y: "110%", opacity: 0 }}
            animate={isInView ? { y: 0, opacity: 1 } : { y: "110%", opacity: 0 }}
            transition={{
              duration: 0.9,
              delay: delay + index * lineDelay,
              ease: [0.215, 0.61, 0.355, 1],
            }}
          >
            {line}
          </motion.div>
        </div>
      ))}
    </div>
  )
}

// =====================================================
// SCROLL REVEAL - Parallax Text on Scroll
// =====================================================
interface ScrollRevealProps {
  children: string
  className?: string
  direction?: "up" | "down" | "left" | "right"
  distance?: number
}

export function ScrollReveal({
  children,
  className = "",
  direction = "up",
  distance = 100,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const transforms = {
    up: useTransform(scrollYProgress, [0, 1], [distance, -distance]),
    down: useTransform(scrollYProgress, [0, 1], [-distance, distance]),
    left: useTransform(scrollYProgress, [0, 1], [distance, -distance]),
    right: useTransform(scrollYProgress, [0, 1], [-distance, distance]),
  }

  const isHorizontal = direction === "left" || direction === "right"

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{
        [isHorizontal ? "x" : "y"]: transforms[direction],
      }}
    >
      {children}
    </motion.div>
  )
}

// =====================================================
// SPLIT HEADING - Large Heading with Split Animation
// =====================================================
interface SplitHeadingProps {
  children: string
  className?: string
  topClassName?: string
  bottomClassName?: string
  delay?: number
}

export function SplitHeading({
  children,
  className = "",
  topClassName = "",
  bottomClassName = "",
  delay = 0,
}: SplitHeadingProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once: true, margin: "-10%" })

  const words = children.split(" ")
  const midPoint = Math.ceil(words.length / 2)
  const topLine = words.slice(0, midPoint).join(" ")
  const bottomLine = words.slice(midPoint).join(" ")

  return (
    <div ref={ref} className={className}>
      {/* Top line */}
      <div className="overflow-hidden">
        <motion.div
          className={topClassName}
          initial={{ y: "110%", skewY: 5 }}
          animate={isInView ? { y: 0, skewY: 0 } : { y: "110%", skewY: 5 }}
          transition={{
            duration: 1,
            delay,
            ease: [0.215, 0.61, 0.355, 1],
          }}
        >
          {topLine}
        </motion.div>
      </div>
      {/* Bottom line */}
      {bottomLine && (
        <div className="overflow-hidden">
          <motion.div
            className={bottomClassName}
            initial={{ y: "110%", skewY: 5 }}
            animate={isInView ? { y: 0, skewY: 0 } : { y: "110%", skewY: 5 }}
            transition={{
              duration: 1,
              delay: delay + 0.1,
              ease: [0.215, 0.61, 0.355, 1],
            }}
          >
            {bottomLine}
          </motion.div>
        </div>
      )}
    </div>
  )
}

// =====================================================
// FADE UP - Simple Fade and Slide Up Animation
// =====================================================
interface FadeUpProps {
  children: ReactNode
  className?: string
  delay?: number
  duration?: number
  distance?: number
  once?: boolean
}

export function FadeUp({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  distance = 40,
  once = true,
}: FadeUpProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, margin: "-10%" })

  return (
    <motion.div
      ref={ref}
      className={className}
      initial={{ y: distance, opacity: 0 }}
      animate={isInView ? { y: 0, opacity: 1 } : { y: distance, opacity: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.215, 0.61, 0.355, 1],
      }}
    >
      {children}
    </motion.div>
  )
}

// =====================================================
// SCROLL PROGRESS TEXT - Text opacity based on scroll
// =====================================================
interface ScrollProgressTextProps {
  children: string
  className?: string
  start?: number
  end?: number
}

export function ScrollProgressText({
  children,
  className = "",
  start = 0,
  end = 1,
}: ScrollProgressTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const words = useMemo(() => children.split(" "), [children])
  const step = (end - start) / words.length

  return (
    <div ref={ref} className={className}>
      {words.map((word, index) => (
        <Word
          key={index}
          progress={scrollYProgress}
          start={start + index * step}
          end={start + (index + 1) * step}
        >
          {word}
        </Word>
      ))}
    </div>
  )
}

function Word({
  children,
  progress,
  start,
  end,
}: {
  children: string
  progress: MotionValue<number>
  start: number
  end: number
}) {
  const opacity = useTransform(progress, [start, end], [0.2, 1])
  const y = useTransform(progress, [start, end], [10, 0])

  return (
    <motion.span className="inline-block mr-[0.25em]" style={{ opacity, y }}>
      {children}
    </motion.span>
  )
}
