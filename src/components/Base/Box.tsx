import type { ReactNode } from "react"

interface Props {
    className?: string
    compact?: boolean
    children: ReactNode
}

export default function Box({
    className = "",
    compact = false,
    children,
}: Props) {
    return (
        <div
            className={`w-full gap-2 rounded-2xl border border-zinc-300 bg-zinc-100 text-neutral-800 dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-300 ${compact ? "px-5 py-4" : "px-8 py-6 max-sm:px-4 max-sm:py-4"} ${className}`}
        >
            {children}
        </div>
    )
}
