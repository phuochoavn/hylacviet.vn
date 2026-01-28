import { Metadata } from "next"
import { getBaseURL } from "@lib/util/env"
import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav"
import ClientWrapper from "./client-wrapper"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default async function PageLayout(props: { children: React.ReactNode }) {
  return (
    <>
      <ClientWrapper>
        <Nav />
        {props.children}
        <Footer />
      </ClientWrapper>
    </>
  )
}
