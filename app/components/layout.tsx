//
// layout.tsx - shared layout component
//

import Head from "next/head"
import Image from "next/image"
import Link from "next/link"

import utilStyles from "../styles/utils.module.css"
import styles from "./layout.module.css"
import Header from "./header"
import Footer from "./footer"

interface LayoutProps {
  children: React.ReactNode
  home?: boolean
  title?: string
}

export default function Layout({ children, title, home }: LayoutProps) {
  title = title || "Biomarkers"

  return (
    <div className={styles.container}>
      <Head>
        <title>{title}</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="Learn how to build a personal website using Next.js" />
        <meta
          property="og:image"
          content={`https://og-image.vercel.app/${encodeURI(
            title
          )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.zeit.co%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
        />
        <meta name="og:title" content={title} />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
