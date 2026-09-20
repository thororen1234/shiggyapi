import type { ReactNode } from "react"

interface Props {
    className?: string
    children: ReactNode
}

export default function Tag({ className, children }: Props) {
    return (
        <span
            className={[
                "inline-flex items-center gap-1 rounded-full bg-zinc-200 px-3 py-1 text-xs font-medium text-neutral-800 dark:bg-zinc-800 dark:text-neutral-300",
                className,
            ]
                .filter(Boolean)
                .join(" ")}
        >
            {children}
        </span>
    )
}
