"use client"

import { motion } from "framer-motion"
import Image from "next/image"

const DesignerStatement = () => {
    return (
        <section className="relative py-32 bg-paper text-ink overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row gap-16 items-center">

                    {/* Portrait / Visual Side */}
                    <motion.div
                        className="w-full lg:w-1/2 relative"
                        initial={{ opacity: 0, x: -50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                    >
                        <div className="relative aspect-[4/5] max-w-md mx-auto">
                            <div className="absolute inset-0 bg-paper-warm transform rotate-3 rounded-lg" />
                            <div className="relative h-full w-full bg-silk-pearl overflow-hidden rounded-lg border border-ink/10 grayscale hover:grayscale-0 transition-all duration-700">
                                <Image
                                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=1000&auto=format&fit=crop"
                                    alt="Chân dung Nhà thiết kế Hân Hân"
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            {/* Decorative signature */}
                            <div className="absolute -bottom-10 -right-10 font-display text-9xl text-ink/5 pointer-events-none select-none">
                                HH
                            </div>
                        </div>
                    </motion.div>

                    {/* Text Side */}
                    <motion.div
                        className="w-full lg:w-1/2"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                    >
                        <span className="block font-sans text-xs tracking-widest uppercase text-ink-muted mb-6">
                            Lời ngỏ từ Nhà thiết kế
                        </span>

                        <h2 className="font-serif text-3xl md:text-4xl leading-relaxed mb-8">
                            "Tôi không bán quần áo. <br />
                            Tôi may những <span className="italic text-silk-rose">khoảng lặng</span> bình yên."
                        </h2>

                        <div className="prose prose-lg text-ink-light font-sans space-y-6">
                            <p>
                                Tôi chọn đi ngược dòng chảy của thời trang nhanh.
                                Giữa thế giới ồn ào và vội vã, tôi tìm thấy vẻ đẹp trong sự chậm rãi của từng mũi thêu,
                                trong độ rủ của tà lụa, và trong sự tĩnh tại của pháp phục.
                            </p>
                            <p>
                                Mỗi thiết kế tại Mai Đo không chỉ để mặc, mà để cảm nhận.
                                Cảm nhận sự nâng niu của chất liệu tự nhiên lên làn da,
                                và sự an yên khi tìm về với những giá trị bản nguyên nhất.
                            </p>
                        </div>

                        <div className="mt-12">
                            <span className="font-signature text-4xl text-ink block transform -rotate-2">
                                Hân Hân
                            </span>
                            <span className="block mt-2 text-xs uppercase tracking-widest text-ink-muted">
                                Founder & Creative Director
                            </span>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    )
}

export default DesignerStatement
