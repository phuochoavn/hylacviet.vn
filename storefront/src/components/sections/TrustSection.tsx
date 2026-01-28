"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"

// Statistics data
const stats = [
    { number: 10, suffix: "+", label: "Năm kinh nghiệm", description: "Trong ngành thời trang áo dài" },
    { number: 5000, suffix: "+", label: "Khách hàng", description: "Tin tưởng và lựa chọn" },
    { number: 100, suffix: "%", label: "Thủ công", description: "Chế tác tỉ mỉ từng đường kim" },
    { number: 30, suffix: "+", label: "Nghệ nhân", description: "Lành nghề và tâm huyết" },
]

// Testimonials data
const testimonials = [
    {
        id: 1,
        content:
            "Áo dài Mai Đỏ thực sự là một tác phẩm nghệ thuật. Tôi đã mặc chiếc áo cưới của họ trong ngày trọng đại và cảm thấy vô cùng tự tin và xinh đẹp.",
        author: "Nguyễn Thu Hà",
        location: "Hà Nội",
        rating: 5,
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=200&auto=format&fit=crop",
    },
    {
        id: 2,
        content:
            "Chất lượng vải tơ tằm tuyệt vời, đường may tinh tế. Đội ngũ tư vấn rất nhiệt tình và chuyên nghiệp. Tôi sẽ quay lại lần sau!",
        author: "Trần Minh Anh",
        location: "TP. Hồ Chí Minh",
        rating: 5,
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop",
    },
    {
        id: 3,
        content:
            "Tôi đã đặt áo dài cho cả gia đình để chụp ảnh Tết. Mọi người đều rất hài lòng với sản phẩm. Cảm ơn Mai Đỏ!",
        author: "Phạm Thảo Linh",
        location: "Đà Nẵng",
        rating: 5,
        image: "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?q=80&w=200&auto=format&fit=crop",
    },
]

// Counter animation hook
function useCounter(end: number, duration: number = 2000, start: boolean = false) {
    const [count, setCount] = useState(0)

    useEffect(() => {
        if (!start) return

        let startTime: number | null = null
        const step = (timestamp: number) => {
            if (!startTime) startTime = timestamp
            const progress = Math.min((timestamp - startTime) / duration, 1)
            setCount(Math.floor(progress * end))
            if (progress < 1) {
                requestAnimationFrame(step)
            }
        }
        requestAnimationFrame(step)
    }, [end, duration, start])

    return count
}

// Single stat component
function StatItem({ stat, index, isInView }: { stat: typeof stats[0]; index: number; isInView: boolean }) {
    const count = useCounter(stat.number, 2000, isInView)

    return (
        <motion.div
            className="text-center px-6 py-8"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: index * 0.1 }}
        >
            <div className="font-display text-4xl md:text-5xl lg:text-6xl text-ink mb-2">
                {count}
                <span className="text-silk-gold">{stat.suffix}</span>
            </div>
            <div className="font-sans text-sm tracking-widest uppercase text-ink mb-1">
                {stat.label}
            </div>
            <div className="font-sans text-xs text-ink-muted">
                {stat.description}
            </div>
        </motion.div>
    )
}

export default function TrustSection() {
    const containerRef = useRef<HTMLDivElement>(null)
    const isInView = useInView(containerRef, { once: true, margin: "-100px" })
    const [activeTestimonial, setActiveTestimonial] = useState(0)

    // Auto-rotate testimonials
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveTestimonial((prev) => (prev + 1) % testimonials.length)
        }, 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <section ref={containerRef} className="py-24 lg:py-32 bg-paper-warm overflow-hidden">
            <div className="container mx-auto px-6">
                {/* Statistics */}
                <motion.div
                    className="mb-20"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : {}}
                    transition={{ duration: 0.8 }}
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-ink/10">
                        {stats.map((stat, index) => (
                            <StatItem key={index} stat={stat} index={index} isInView={isInView} />
                        ))}
                    </div>
                </motion.div>

                {/* Divider */}
                <div className="flex items-center justify-center gap-4 mb-20">
                    <span className="w-24 h-px bg-ink/10" />
                    <span className="font-serif text-xl text-ink-muted italic">Khách hàng nói gì</span>
                    <span className="w-24 h-px bg-ink/10" />
                </div>

                {/* Testimonials Carousel */}
                <div className="max-w-4xl mx-auto">
                    <div className="relative">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.id}
                                className={`${index === activeTestimonial ? "block" : "hidden"}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: index === activeTestimonial ? 1 : 0, y: index === activeTestimonial ? 0 : 20 }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="text-center">
                                    {/* Quote icon */}
                                    <svg
                                        className="w-12 h-12 mx-auto mb-8 text-silk-gold/30"
                                        fill="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                                    </svg>

                                    {/* Content */}
                                    <blockquote className="font-serif text-xl md:text-2xl lg:text-3xl text-ink leading-relaxed mb-8 italic">
                                        "{testimonial.content}"
                                    </blockquote>

                                    {/* Author */}
                                    <div className="flex items-center justify-center gap-4">
                                        <img
                                            src={testimonial.image}
                                            alt={testimonial.author}
                                            className="w-14 h-14 rounded-full object-cover"
                                        />
                                        <div className="text-left">
                                            <div className="font-sans text-sm font-medium text-ink">
                                                {testimonial.author}
                                            </div>
                                            <div className="font-sans text-xs text-ink-muted">
                                                {testimonial.location}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Rating */}
                                    <div className="flex justify-center gap-1 mt-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className="w-4 h-4 text-silk-gold fill-current"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                            </svg>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Dots navigation */}
                    <div className="flex justify-center gap-3 mt-10">
                        {testimonials.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveTestimonial(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${index === activeTestimonial
                                        ? "bg-ink w-8"
                                        : "bg-ink/30 hover:bg-ink/50"
                                    }`}
                                aria-label={`Xem đánh giá ${index + 1}`}
                            />
                        ))}
                    </div>
                </div>

                {/* Trust Badges */}
                <motion.div
                    className="mt-20 pt-16 border-t border-ink/10"
                    initial={{ opacity: 0, y: 30 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.6, delay: 0.4 }}
                >
                    <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
                        {[
                            { icon: "🚚", text: "Miễn phí vận chuyển" },
                            { icon: "🔄", text: "Đổi trả 30 ngày" },
                            { icon: "✅", text: "Bảo hành 1 năm" },
                            { icon: "💳", text: "Thanh toán an toàn" },
                            { icon: "📞", text: "Hỗ trợ 24/7" },
                        ].map((badge, index) => (
                            <div key={index} className="flex items-center gap-2 text-ink-muted">
                                <span className="text-2xl">{badge.icon}</span>
                                <span className="font-sans text-sm">{badge.text}</span>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
