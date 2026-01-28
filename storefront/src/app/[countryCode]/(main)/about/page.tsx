"use client"

import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import { useRef } from "react"
import { FadeIn, StaggerContainer, StaggerItem, Parallax } from "@/components/ui/AnimationUtils"
import MagneticButton from "@/components/ui/MagneticButton"

// Timeline milestones
const timeline = [
    {
        year: "2016",
        title: "Khởi Đầu",
        description: "Mai Đỏ ra đời từ niềm đam mê với áo dài Việt Nam và mong muốn mang đến những thiết kế độc đáo.",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=600&auto=format&fit=crop",
    },
    {
        year: "2018",
        title: "Mở Rộng",
        description: "Khai trương cửa hàng đầu tiên tại Quận 1, TP.HCM với đội ngũ 10 nghệ nhân lành nghề.",
        image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=600&auto=format&fit=crop",
    },
    {
        year: "2020",
        title: "Đổi Mới",
        description: "Ra mắt dòng Áo Dài Cách Tân, kết hợp truyền thống và hiện đại, được giới trẻ đón nhận nồng nhiệt.",
        image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=600&auto=format&fit=crop",
    },
    {
        year: "2023",
        title: "Khẳng Định",
        description: "Đạt giải thưởng 'Thương hiệu Áo Dài Việt Nam' do Hiệp hội Thời trang trao tặng.",
        image: "https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=600&auto=format&fit=crop",
    },
    {
        year: "2026",
        title: "Hướng Tới",
        description: "Mở rộng ra thị trường quốc tế, mang vẻ đẹp áo dài Việt Nam đến với thế giới.",
        image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=600&auto=format&fit=crop",
    },
]

// Team members
const team = [
    {
        name: "Nguyễn Thị Mai",
        role: "Founder & Creative Director",
        image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=400&auto=format&fit=crop",
    },
    {
        name: "Trần Văn Đức",
        role: "Head of Production",
        image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    },
    {
        name: "Lê Thị Hồng",
        role: "Lead Designer",
        image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=400&auto=format&fit=crop",
    },
    {
        name: "Phạm Minh Tuấn",
        role: "Master Tailor",
        image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
    },
]

// Values
const values = [
    {
        icon: "✦",
        title: "Thủ Công",
        description: "100% may đo thủ công, từng đường kim mũi chỉ đều được chế tác tỉ mỉ.",
    },
    {
        icon: "❖",
        title: "Chất Lượng",
        description: "Chỉ sử dụng chất liệu cao cấp nhất: tơ tằm, gấm, lụa từ các làng nghề truyền thống.",
    },
    {
        icon: "◈",
        title: "Di Sản",
        description: "Gìn giữ và phát huy giá trị văn hóa áo dài Việt Nam qua từng thiết kế.",
    },
    {
        icon: "✧",
        title: "Đổi Mới",
        description: "Không ngừng sáng tạo, kết hợp tinh hoa truyền thống với xu hướng đương đại.",
    },
]

export default function AboutPage() {
    const containerRef = useRef<HTMLDivElement>(null)

    return (
        <main ref={containerRef} className="bg-paper">
            {/* Hero Section */}
            <AboutHero />

            {/* Story Section */}
            <StorySection />

            {/* Timeline Section */}
            <TimelineSection timeline={timeline} />

            {/* Values Section */}
            <ValuesSection values={values} />

            {/* Team Section */}
            <TeamSection team={team} />

            {/* CTA Section */}
            <CTASection />
        </main>
    )
}

// Hero Component
function AboutHero() {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start start", "end start"],
    })

    const y = useTransform(scrollYProgress, [0, 1], [0, 200])
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

    return (
        <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
            {/* Background */}
            <motion.div className="absolute inset-0" style={{ y }}>
                <Image
                    src="https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=2000&auto=format&fit=crop"
                    alt="Mai Đỏ Workshop"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-ink/50" />
            </motion.div>

            {/* Content */}
            <motion.div className="relative z-10 text-center px-6" style={{ opacity }}>
                <motion.span
                    className="inline-flex items-center gap-3 font-sans text-xs tracking-[0.4em] uppercase text-paper/70 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                >
                    <span className="w-8 h-px bg-silk-gold" />
                    Về Chúng Tôi
                    <span className="w-8 h-px bg-silk-gold" />
                </motion.span>

                <motion.h1
                    className="font-display text-5xl md:text-7xl lg:text-8xl text-paper mb-6"
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    Câu Chuyện
                    <br />
                    <span className="text-silk-gold italic">Mai Đỏ</span>
                </motion.h1>

                <motion.p
                    className="font-serif text-xl text-paper/80 italic max-w-xl mx-auto"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    "Di sản trong hơi thở mới"
                </motion.p>

                {/* Scroll indicator */}
                <motion.div
                    className="absolute bottom-12 left-1/2 -translate-x-1/2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1.2 }}
                >
                    <motion.div
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <svg className="w-6 h-6 text-paper/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                        </svg>
                    </motion.div>
                </motion.div>
            </motion.div>
        </section>
    )
}

// Story Section
function StorySection() {
    return (
        <section className="py-24 lg:py-32 bg-paper">
            <div className="container mx-auto px-6">
                <div className="grid lg:grid-cols-2 gap-16 items-center">
                    {/* Image */}
                    <FadeIn direction="left" className="relative">
                        <Parallax speed={0.3}>
                            <div className="relative aspect-[4/5] overflow-hidden">
                                <Image
                                    src="https://images.unsplash.com/photo-1558171813-4c088753af8f?q=80&w=1000&auto=format&fit=crop"
                                    alt="Nghệ nhân Mai Đỏ"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </Parallax>
                        {/* Decorative frame */}
                        <div className="absolute -bottom-6 -right-6 w-full h-full border border-silk-gold/30 -z-10" />
                    </FadeIn>

                    {/* Content */}
                    <FadeIn direction="right" delay={0.2}>
                        <span className="inline-flex items-center gap-3 font-sans text-xs tracking-[0.3em] uppercase text-ink-muted mb-6">
                            <span className="w-8 h-px bg-silk-gold" />
                            Câu Chuyện Của Chúng Tôi
                        </span>

                        <h2 className="font-display text-4xl lg:text-5xl text-ink mb-8 leading-tight">
                            Từ đam mê đến
                            <br />
                            <span className="italic text-silk-gold">thương hiệu</span>
                        </h2>

                        <div className="space-y-6 font-sans text-ink-light leading-relaxed">
                            <p>
                                Mai Đỏ ra đời từ niềm đam mê sâu sắc với áo dài Việt Nam - trang phục truyền thống
                                đã đi vào lịch sử và văn hóa dân tộc qua bao thế hệ.
                            </p>
                            <p>
                                Chúng tôi tin rằng mỗi chiếc áo dài không chỉ là một trang phục, mà còn là một
                                tác phẩm nghệ thuật, một câu chuyện về vẻ đẹp và sự tinh tế của người phụ nữ Việt Nam.
                            </p>
                            <p>
                                Với đội ngũ hơn 30 nghệ nhân lành nghề, chúng tôi tự hào mang đến những thiết kế
                                độc đáo, kết hợp hài hòa giữa truyền thống và hiện đại.
                            </p>
                        </div>

                        <div className="mt-10">
                            <MagneticButton href="/vn/store" variant="primary" size="lg">
                                Khám Phá Bộ Sưu Tập
                            </MagneticButton>
                        </div>
                    </FadeIn>
                </div>
            </div>
        </section>
    )
}

// Timeline Section
function TimelineSection({ timeline }: { timeline: typeof timeline }) {
    const ref = useRef<HTMLDivElement>(null)
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start end", "end start"],
    })

    return (
        <section ref={ref} className="py-24 lg:py-32 bg-paper-warm overflow-hidden">
            <div className="container mx-auto px-6">
                {/* Header */}
                <FadeIn className="text-center mb-16">
                    <span className="inline-flex items-center gap-3 font-sans text-xs tracking-[0.3em] uppercase text-ink-muted mb-4">
                        <span className="w-8 h-px bg-silk-gold" />
                        Hành Trình
                        <span className="w-8 h-px bg-silk-gold" />
                    </span>
                    <h2 className="font-display text-4xl lg:text-5xl text-ink">
                        10 Năm Phát Triển
                    </h2>
                </FadeIn>

                {/* Timeline */}
                <div className="relative">
                    {/* Line */}
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-ink/10 hidden lg:block" />

                    <StaggerContainer staggerDelay={0.2} className="space-y-16 lg:space-y-24">
                        {timeline.map((item, index) => (
                            <StaggerItem key={item.year}>
                                <div className={`flex flex-col lg:flex-row gap-8 lg:gap-16 items-center ${index % 2 === 1 ? "lg:flex-row-reverse" : ""
                                    }`}>
                                    {/* Image */}
                                    <div className="w-full lg:w-1/2">
                                        <div className="relative aspect-video overflow-hidden group">
                                            <Image
                                                src={item.image}
                                                alt={item.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className={`w-full lg:w-1/2 ${index % 2 === 1 ? "lg:text-right" : ""}`}>
                                        <span className="inline-block font-display text-6xl text-silk-gold/30 mb-2">
                                            {item.year}
                                        </span>
                                        <h3 className="font-display text-3xl text-ink mb-4">{item.title}</h3>
                                        <p className="font-sans text-ink-light leading-relaxed">{item.description}</p>
                                    </div>
                                </div>
                            </StaggerItem>
                        ))}
                    </StaggerContainer>
                </div>
            </div>
        </section>
    )
}

// Values Section
function ValuesSection({ values }: { values: typeof values }) {
    return (
        <section className="py-24 lg:py-32 bg-ink text-paper">
            <div className="container mx-auto px-6">
                <FadeIn className="text-center mb-16">
                    <span className="inline-flex items-center gap-3 font-sans text-xs tracking-[0.3em] uppercase text-paper/50 mb-4">
                        <span className="w-8 h-px bg-silk-gold" />
                        Giá Trị
                        <span className="w-8 h-px bg-silk-gold" />
                    </span>
                    <h2 className="font-display text-4xl lg:text-5xl">
                        Điều Chúng Tôi <span className="text-silk-gold italic">Tin Tưởng</span>
                    </h2>
                </FadeIn>

                <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {values.map((value) => (
                        <StaggerItem key={value.title}>
                            <div className="text-center p-8 border border-paper/10 hover:border-paper/30 transition-colors group">
                                <motion.span
                                    className="block text-4xl mb-6 text-silk-gold"
                                    whileHover={{ scale: 1.2, rotate: 180 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    {value.icon}
                                </motion.span>
                                <h3 className="font-display text-2xl mb-4">{value.title}</h3>
                                <p className="font-sans text-sm text-paper/60 leading-relaxed">{value.description}</p>
                            </div>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    )
}

// Team Section
function TeamSection({ team }: { team: typeof team }) {
    return (
        <section className="py-24 lg:py-32 bg-paper">
            <div className="container mx-auto px-6">
                <FadeIn className="text-center mb-16">
                    <span className="inline-flex items-center gap-3 font-sans text-xs tracking-[0.3em] uppercase text-ink-muted mb-4">
                        <span className="w-8 h-px bg-silk-gold" />
                        Đội Ngũ
                        <span className="w-8 h-px bg-silk-gold" />
                    </span>
                    <h2 className="font-display text-4xl lg:text-5xl text-ink">
                        Những Người <span className="text-silk-gold italic">Tạo Nên</span> Mai Đỏ
                    </h2>
                </FadeIn>

                <StaggerContainer staggerDelay={0.1} className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {team.map((member) => (
                        <StaggerItem key={member.name}>
                            <div className="group cursor-pointer">
                                <div className="relative aspect-[3/4] overflow-hidden mb-6">
                                    <Image
                                        src={member.image}
                                        alt={member.name}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-ink/0 group-hover:bg-ink/20 transition-colors" />
                                </div>
                                <h3 className="font-display text-xl text-ink mb-1">{member.name}</h3>
                                <p className="font-sans text-sm text-ink-muted">{member.role}</p>
                            </div>
                        </StaggerItem>
                    ))}
                </StaggerContainer>
            </div>
        </section>
    )
}

// CTA Section
function CTASection() {
    return (
        <section className="py-24 lg:py-32 bg-paper-warm">
            <div className="container mx-auto px-6 text-center">
                <FadeIn>
                    <span className="inline-flex items-center gap-3 font-sans text-xs tracking-[0.3em] uppercase text-ink-muted mb-6">
                        <span className="w-8 h-px bg-silk-gold" />
                        Liên Hệ
                        <span className="w-8 h-px bg-silk-gold" />
                    </span>

                    <h2 className="font-display text-4xl lg:text-5xl text-ink mb-6">
                        Bắt đầu hành trình
                        <br />
                        <span className="italic text-silk-gold">của riêng bạn</span>
                    </h2>

                    <p className="font-serif text-lg text-ink-light italic max-w-2xl mx-auto mb-10">
                        Hãy để Mai Đỏ đồng hành cùng bạn trong những dịp quan trọng.
                        Liên hệ ngay để được tư vấn miễn phí.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <MagneticButton href="tel:+84123456789" variant="primary" size="lg">
                            Hotline: 0123.456.789
                        </MagneticButton>
                        <MagneticButton href="/vn/store" variant="secondary" size="lg">
                            Khám Phá Ngay
                        </MagneticButton>
                    </div>
                </FadeIn>
            </div>
        </section>
    )
}
