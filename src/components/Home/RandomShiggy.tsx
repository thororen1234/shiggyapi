"use client"

import { useState } from "react"
import Link from "next/link"
import { Images, Link as LinkIcon, Shuffle } from "lucide-react"

const secondary =
    "flex items-center gap-1.5 rounded-lg bg-zinc-200 px-3 py-2 text-sm font-medium text-neutral-800 transition hover:bg-zinc-300 dark:bg-zinc-800 dark:text-neutral-200 dark:hover:bg-zinc-700"

export default function RandomShiggy({ initial }: { initial: string }) {
    const [filename, setFilename] = useState(initial)
    const [fetching, setFetching] = useState(false)

    async function anotherOne() {
        setFetching(true)
        try {
            const res = await fetch("/api/random")
            const json = await res.json()
            setFilename(json.filename)
        } finally {
            setFetching(false)
        }
    }

    return (
        <>
            <img
                src={`/image/${filename}`}
                alt="Shiggy"
                id="shiggy-img"
                className={`aspect-square w-full max-w-sm rounded-xl object-contain transition-opacity ${fetching ? "opacity-50" : ""}`}
            />

            <div className="flex flex-wrap items-center justify-center gap-2">
                <button
                    onClick={anotherOne}
                    disabled={fetching}
                    id="another-one-btn"
                    className="flex cursor-pointer items-center gap-1.5 rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-rose-500 active:scale-[.97] disabled:cursor-default disabled:opacity-50"
                >
                    <Shuffle size={16} />
                    {fetching ? "..." : "Another One?"}
                </button>

                <a
                    href={`/image/${filename}`}
                    id="permalink-btn"
                    className={secondary}
                >
                    <LinkIcon size={16} />
                    Permalink
                </a>

                <Link href="/view" id="view-all-btn" className={secondary}>
                    <Images size={16} />
                    View All
                </Link>
            </div>
        </>
    )
}
