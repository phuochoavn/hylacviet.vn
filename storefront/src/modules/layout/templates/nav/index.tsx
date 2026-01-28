import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SideMenu from "@modules/layout/components/side-menu"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      {/* Glassmorphism Header */}
      <header className="relative h-20 mx-auto bg-paper/80 backdrop-blur-xl border-b border-ink/5 transition-all duration-300">
        <nav className="container mx-auto px-6 flex items-center justify-between w-full h-full">

          {/* Left: Menu Button */}
          <div className="flex-1 basis-0 h-full flex items-center">
            <SideMenu regions={regions} locales={locales} currentLocale={currentLocale} />
          </div>

          {/* Center: Logo - Text only */}
          <div className="flex items-center justify-center h-full">
            <LocalizedClientLink
              href="/"
              className="group flex flex-col items-center"
              data-testid="nav-store-link"
            >
              <div className="flex flex-col items-center">
                <span className="font-display text-3xl tracking-widest text-ink">
                  MAI ĐỎ
                </span>
                <span className="font-serif text-[10px] tracking-[0.3em] text-ink-muted uppercase">
                  Áo Dài Việt Nam
                </span>
              </div>
            </LocalizedClientLink>
          </div>

          {/* Right: Search & Account only (no Cart) */}
          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            {/* Search Icon */}
            <button
              className="hidden md:flex items-center justify-center w-10 h-10 rounded-full hover:bg-ink/5 transition-colors"
              aria-label="Tìm kiếm"
            >
              <svg className="w-5 h-5 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Account */}
            <LocalizedClientLink
              className="hidden md:flex items-center gap-2 font-sans text-sm tracking-wide text-ink hover:text-ink-light transition-colors"
              href="/account"
              data-testid="nav-account-link"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <span>Tài khoản</span>
            </LocalizedClientLink>
          </div>
        </nav>
      </header>
    </div>
  )
}
