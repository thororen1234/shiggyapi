import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Images } from "lucide-react"
import Section from "@/components/Base/Section"
import Tag from "@/components/Base/Tag"
import { getImages } from "@/lib/images"

export const metadata: Metadata = { title: "All Shiggy Images" }

export default function Page() {
    const files = getImages()
    if (!files.length) notFound()

    return (
        <Section
            icon={Images}
            title="All Images"
            badge={<Tag className="ml-1">{files.length}</Tag>}
        >
            <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-3">
                {files.map((file) => (
                    <a
                        key={file}
                        href={`/image/${file}`}
                        id={`thumb-${file}`}
                        className="block aspect-square overflow-hidden rounded-2xl border border-zinc-300 bg-zinc-100 transition hover:scale-[1.03] hover:border-rose-500 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-rose-500"
                    >
                        <img
                            src={`/image/${file}`}
                            alt={file}
                            loading="lazy"
                            className="size-full object-cover"
                        />
                    </a>
                ))}
            </div>
        </Section>
    )
}
