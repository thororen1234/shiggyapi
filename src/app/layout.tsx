import "@/styles/inter.css"
import "@/styles/global.css"
import { cache, type ReactNode } from "react"
import type { Metadata, Viewport } from "next"
import Footer from "@/components/Layout/Footer"
import Header from "@/components/Layout/Header"
import { randomShiggy } from "@/lib/images"

export const dynamic = "force-dynamic"

const getAvatar = cache(randomShiggy)

export function generateMetadata(): Metadata {
    const avatar = getAvatar()
    if (!avatar) return {}
    return { icons: { icon: { url: `/image/${avatar}`, type: "image/png" } } }
}

export const viewport: Viewport = {
    themeColor: "#970000ff",
}

const themeScript = `try{var t=localStorage.getItem('theme');if(t!=='light'&&t!=='dark'){t=matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';localStorage.setItem('theme',t)}document.documentElement.setAttribute('data-theme',t)}catch(e){}`

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <script dangerouslySetInnerHTML={{ __html: themeScript }} />
            </head>
            <body>
                <div className="flex min-h-dvh flex-col">
                    <Header avatar={getAvatar()} />
                    <main className="flex flex-1 flex-col gap-8 px-3 pt-6">
                        {children}
                    </main>
                    <Footer />
                </div>
            </body>
        </html>
    )
}
