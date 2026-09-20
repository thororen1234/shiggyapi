"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import ThemeToggle from "@/components/ThemeToggle"
import { navLinks } from "@/consts"

export default function Header({ avatar }: { avatar: string | null }) {
    const pathname = usePathname()

    return (
        <header className="sticky top-0 z-40 px-3 pt-3">
            <div className="flex items-center gap-2 rounded-2xl border border-zinc-300 bg-zinc-100/90 px-3 py-2 backdrop-blur dark:border-zinc-800 dark:bg-zinc-900/90">
                <Link
                    href="/"
                    className="flex items-center gap-2 rounded-lg pr-2 font-semibold text-neutral-800 dark:text-neutral-200"
                >
                    {avatar && (
                        <img
                            src={`/image/${avatar}`}
                            alt=""
                            width={28}
                            height={28}
                            draggable={false}
                            className="size-7 rounded-full object-cover select-none"
                        />
                    )}
                    <span className="hidden sm:inline">The Shiggy API</span>
                </Link>

                <nav className="ml-auto flex items-center gap-1">
                    {navLinks.map(({ text, href, icon: Icon }) => {
                        const active =
                            href === "/"
                                ? pathname === "/"
                                : pathname.startsWith(href)

                        return (
                            <Link
                                key={href}
                                href={href}
                                aria-current={active ? "page" : undefined}
                                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                    active
                                        ? "bg-zinc-200 text-neutral-900 dark:bg-zinc-800 dark:text-neutral-100"
                                        : "text-neutral-600 hover:bg-zinc-200 dark:text-neutral-400 dark:hover:bg-zinc-800"
                                }`}
                            >
                                <Icon size={16} className="max-sm:hidden" />
                                {text}
                            </Link>
                        )
                    })}
                </nav>

                <ThemeToggle />
            </div>
        </header>
    )
}
