import { Metadata } from "next"
import { getBaseURL } from "@lib/util/env"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import ClientWrapper from "./client-wrapper"

// ============================================
// METADATA
// ============================================

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

// ============================================
// LAYOUT COMPONENT
// ============================================

export default async function PageLayout(props: {
  children: React.ReactNode
}) {
  return (
    <ClientWrapper>
      {/* Navigation - Fixed/Sticky Header */}
      <Nav />

      {/* Main Content Area */}
      <div className="flex-1">
        {props.children}
      </div>

      {/* Footer */}
      <Footer />
    </ClientWrapper>
  )
}
