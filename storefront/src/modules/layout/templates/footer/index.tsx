import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

// Navigation links
const navigationLinks = [
  { name: "Trang Chủ", href: "/" },
  { name: "Bộ Sưu Tập", href: "/store" },
  { name: "Áo Dài Cưới", href: "/categories/ao-dai-cuoi" },
  { name: "Áo Dài Lụa", href: "/categories/ao-dai-lua" },
  { name: "Về Chúng Tôi", href: "/about" },
]

const supportLinks = [
  { name: "Chính sách đổi trả", href: "/policies/return" },
  { name: "Hướng dẫn chọn size", href: "/size-guide" },
  { name: "Thông tin vận chuyển", href: "/shipping" },
  { name: "Câu hỏi thường gặp", href: "/faq" },
  { name: "Liên hệ", href: "/contact" },
]

const socialLinks = [
  {
    name: "Facebook",
    href: "https://facebook.com/maido",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  {
    name: "Instagram",
    href: "https://instagram.com/maido.aodai",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://tiktok.com/@maido.aodai",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://youtube.com/@maido",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
]

const paymentMethods = [
  { name: "COD", label: "COD" },
  { name: "Visa", label: "VISA" },
  { name: "Mastercard", label: "MC" },
  { name: "MoMo", label: "MoMo" },
  { name: "VNPay", label: "VNPay" },
  { name: "ZaloPay", label: "Zalo" },
]

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer className="bg-ink text-paper">
      {/* Main Footer Content */}
      <div className="container mx-auto px-6 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <LocalizedClientLink href="/" className="inline-block mb-6">
              <span className="font-display text-3xl tracking-widest">MAI ĐỎ</span>
            </LocalizedClientLink>
            <p className="font-serif text-paper/70 italic mb-6">
              "Di sản trong hơi thở mới"
            </p>
            <p className="font-sans text-sm text-paper/60 leading-relaxed mb-8">
              Thương hiệu áo dài cao cấp với hơn 10 năm kinh nghiệm,
              mang đến những tác phẩm thủ công tinh xảo cho phụ nữ Việt.
            </p>

            {/* Social Links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-full border border-paper/20 flex items-center justify-center text-paper/60 hover:text-paper hover:border-paper/60 transition-colors"
                  aria-label={social.name}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation Column */}
          <div>
            <h3 className="font-sans text-xs tracking-[0.3em] uppercase text-paper/40 mb-6">
              Điều Hướng
            </h3>
            <ul className="space-y-3">
              {navigationLinks.map((link) => (
                <li key={link.name}>
                  <LocalizedClientLink
                    href={link.href}
                    className="font-sans text-sm text-paper/70 hover:text-paper transition-colors"
                  >
                    {link.name}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>

            {/* Dynamic Collections */}
            {collections && collections.length > 0 && (
              <div className="mt-8">
                <h4 className="font-sans text-xs tracking-[0.2em] uppercase text-paper/40 mb-4">
                  Bộ Sưu Tập
                </h4>
                <ul className="space-y-2">
                  {collections.slice(0, 4).map((collection) => (
                    <li key={collection.id}>
                      <LocalizedClientLink
                        href={`/collections/${collection.handle}`}
                        className="font-sans text-sm text-paper/60 hover:text-paper transition-colors"
                      >
                        {collection.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Support Column */}
          <div>
            <h3 className="font-sans text-xs tracking-[0.3em] uppercase text-paper/40 mb-6">
              Hỗ Trợ
            </h3>
            <ul className="space-y-3">
              {supportLinks.map((link) => (
                <li key={link.name}>
                  <LocalizedClientLink
                    href={link.href}
                    className="font-sans text-sm text-paper/70 hover:text-paper transition-colors"
                  >
                    {link.name}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Column */}
          <div>
            <h3 className="font-sans text-xs tracking-[0.3em] uppercase text-paper/40 mb-6">
              Liên Hệ
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-paper/40 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <div>
                  <p className="font-sans text-sm text-paper/70">
                    123 Nguyễn Huệ, Quận 1
                  </p>
                  <p className="font-sans text-sm text-paper/70">
                    TP. Hồ Chí Minh, Việt Nam
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-paper/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a
                  href="tel:+84123456789"
                  className="font-sans text-sm text-paper/70 hover:text-paper transition-colors"
                >
                  0123 456 789
                </a>
              </div>

              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-paper/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a
                  href="mailto:lienhe@maido.vn"
                  className="font-sans text-sm text-paper/70 hover:text-paper transition-colors"
                >
                  lienhe@maido.vn
                </a>
              </div>

              <div className="flex items-center gap-3">
                <svg className="w-5 h-5 text-paper/40 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="font-sans text-sm text-paper/70">
                  T2 - CN: 9:00 - 21:00
                </p>
              </div>
            </div>

            {/* Newsletter */}
            <div className="mt-8">
              <h4 className="font-sans text-xs tracking-[0.2em] uppercase text-paper/40 mb-4">
                Đăng ký nhận tin
              </h4>
              <form className="flex">
                <input
                  type="email"
                  placeholder="Email của bạn"
                  className="flex-1 bg-paper/10 border border-paper/20 px-4 py-3 text-sm text-paper placeholder-paper/40 focus:outline-none focus:border-paper/40"
                />
                <button
                  type="submit"
                  className="bg-silk-gold text-ink px-4 py-3 font-sans text-xs tracking-widest uppercase hover:bg-silk-gold/90 transition-colors"
                >
                  Gửi
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-paper/10">
        <div className="container mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <p className="font-sans text-xs text-paper/50">
              © {new Date().getFullYear()} Mai Đỏ. Tất cả quyền được bảo lưu.
            </p>

            {/* Payment Methods */}
            <div className="flex items-center gap-4">
              <span className="font-sans text-xs text-paper/40">Thanh toán:</span>
              <div className="flex gap-2">
                {paymentMethods.map((method) => (
                  <div
                    key={method.name}
                    className="bg-paper/10 px-2 py-1 text-xs text-paper/60 font-sans"
                    title={method.name}
                  >
                    {method.label}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
