"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { Fragment } from "react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"
import { useToggleState } from "@medusajs/ui"

// Menu items với tiếng Việt
const MainMenuItems = [
  { name: "Trang Chủ", href: "/", description: "Về trang chính" },
  { name: "Bộ Sưu Tập", href: "/store", description: "Khám phá tất cả sản phẩm" },
  { name: "Áo Dài Cưới", href: "/categories/ao-dai-cuoi", description: "Áo dài cho ngày trọng đại" },
  { name: "Áo Dài Lụa", href: "/categories/ao-dai-lua", description: "Tinh hoa tơ tằm Việt Nam" },
]

const SecondaryMenuItems = [
  { name: "Về Chúng Tôi", href: "/about" },
  { name: "Liên Hệ", href: "/contact" },
  { name: "Tài Khoản", href: "/account" },
  { name: "Giỏ Hàng", href: "/cart" },
]

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  return (
    <div className="h-full">
      <Popover className="h-full flex">
        {({ open, close }) => (
          <>
            {/* Menu Button */}
            <Popover.Button
              data-testid="nav-menu-button"
              className="relative h-full flex items-center gap-2 font-sans text-sm tracking-wide text-ink hover:text-ink-light transition-colors focus:outline-none"
            >
              <div className="flex flex-col gap-1.5 w-6">
                <span className={`block h-0.5 bg-current transition-all duration-300 ${open ? 'rotate-45 translate-y-2' : ''}`} />
                <span className={`block h-0.5 bg-current transition-all duration-300 ${open ? 'opacity-0' : ''}`} />
                <span className={`block h-0.5 bg-current transition-all duration-300 ${open ? '-rotate-45 -translate-y-2' : ''}`} />
              </div>
              <span className="hidden md:inline">Menu</span>
            </Popover.Button>

            {/* Backdrop */}
            <Transition
              show={open}
              as={Fragment}
              enter="transition-opacity duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-300"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div
                className="fixed inset-0 z-[60] bg-ink/60 backdrop-blur-sm"
                onClick={close}
              />
            </Transition>

            {/* Menu Panel - Full screen overlay */}
            <Transition
              show={open}
              as={Fragment}
              enter="transition-all duration-500 ease-out"
              enterFrom="opacity-0 -translate-x-full"
              enterTo="opacity-100 translate-x-0"
              leave="transition-all duration-400 ease-in"
              leaveFrom="opacity-100 translate-x-0"
              leaveTo="opacity-0 -translate-x-full"
            >
              <PopoverPanel className="fixed left-0 top-0 z-[70] h-screen w-full md:w-[480px] lg:w-[560px]">
                <div
                  data-testid="nav-menu-popup"
                  className="flex flex-col h-full bg-paper overflow-y-auto"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-8 py-6 border-b border-ink/10">
                    <span className="font-display text-2xl tracking-widest text-ink">MAI ĐỎ</span>
                    <button
                      data-testid="close-menu-button"
                      onClick={close}
                      className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-ink/5 transition-colors"
                    >
                      <svg className="w-6 h-6 text-ink" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Main Navigation */}
                  <div className="flex-1 px-8 py-10">
                    <nav className="space-y-1">
                      {MainMenuItems.map((item, index) => (
                        <LocalizedClientLink
                          key={item.name}
                          href={item.href}
                          onClick={close}
                          className="group block py-4 border-b border-ink/5 transition-colors hover:border-ink/20"
                          data-testid={`${item.name.toLowerCase().replace(/\s/g, '-')}-link`}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="block font-display text-3xl md:text-4xl text-ink group-hover:text-silk-gold transition-colors">
                                {item.name}
                              </span>
                              <span className="block mt-1 font-sans text-sm text-ink-muted">
                                {item.description}
                              </span>
                            </div>
                            <svg
                              className="w-6 h-6 text-ink-muted group-hover:text-ink group-hover:translate-x-2 transition-all"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                            </svg>
                          </div>
                        </LocalizedClientLink>
                      ))}
                    </nav>

                    {/* Secondary Links */}
                    <div className="mt-10 pt-8 border-t border-ink/10">
                      <div className="grid grid-cols-2 gap-4">
                        {SecondaryMenuItems.map((item) => (
                          <LocalizedClientLink
                            key={item.name}
                            href={item.href}
                            onClick={close}
                            className="font-sans text-sm text-ink-light hover:text-ink transition-colors"
                          >
                            {item.name}
                          </LocalizedClientLink>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Footer - Region & Language */}
                  <div className="px-8 py-6 bg-paper-warm border-t border-ink/10">
                    <div className="flex flex-col gap-4">
                      {/* Language Select */}
                      {!!locales?.length && (
                        <div
                          className="flex items-center justify-between py-2"
                          onMouseEnter={languageToggleState.open}
                          onMouseLeave={languageToggleState.close}
                        >
                          <span className="font-sans text-xs tracking-widest uppercase text-ink-muted">
                            Ngôn ngữ
                          </span>
                          <LanguageSelect
                            toggleState={languageToggleState}
                            locales={locales}
                            currentLocale={currentLocale}
                          />
                        </div>
                      )}

                      {/* Country Select */}
                      {regions && (
                        <div
                          className="flex items-center justify-between py-2"
                          onMouseEnter={countryToggleState.open}
                          onMouseLeave={countryToggleState.close}
                        >
                          <span className="font-sans text-xs tracking-widest uppercase text-ink-muted">
                            Vùng / Quốc gia
                          </span>
                          <CountrySelect
                            toggleState={countryToggleState}
                            regions={regions}
                          />
                        </div>
                      )}
                    </div>

                    {/* Copyright - Brand, NOT Medusa */}
                    <div className="mt-6 pt-4 border-t border-ink/5">
                      <p className="font-sans text-xs text-ink-muted">
                        © {new Date().getFullYear()} Mai Đỏ. Tất cả quyền được bảo lưu.
                      </p>
                    </div>
                  </div>
                </div>
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}

export default SideMenu
