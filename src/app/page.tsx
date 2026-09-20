import { cache } from "react"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Braces, Shuffle } from "lucide-react"
import Box from "@/components/Base/Box"
import Section from "@/components/Base/Section"
import Tag from "@/components/Base/Tag"
import Endpoints from "@/components/Home/Endpoints"
import RandomShiggy from "@/components/Home/RandomShiggy"
import { getImages, randomShiggy } from "@/lib/images"
import { getOrigin } from "@/lib/origin"

const getPick = cache(() => {
    const filename = randomShiggy()
    if (!filename) notFound()
    return { filename, total: getImages().length }
})

export async function generateMetadata(): Promise<Metadata> {
    const { filename, total } = getPick()
    const origin = await getOrigin()

    const title = "The Shiggy API"
    const description = `${total} random images of Shiggy and counting...`
    const image = `${origin}/image/${filename}`

    return {
        title: "Shiggy",
        openGraph: {
            title,
            description,
            images: [image],
            type: "website",
            url: `${origin}/`,
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
        },
    }
}

export default function Page() {
    const { filename, total } = getPick()

    return (
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,28rem)_minmax(0,1fr)]">
            <Section
                icon={Shuffle}
                title="Random Shiggy"
                badge={<Tag className="ml-1">{total} images</Tag>}
            >
                <Box className="flex flex-col items-center gap-5">
                    <RandomShiggy initial={filename} />
                </Box>
            </Section>

            <Section icon={Braces} title="API">
                <Endpoints />
            </Section>
        </div>
    )
}
