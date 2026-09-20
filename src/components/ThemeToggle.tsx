"use client"

import { Moon, Sun } from "lucide-react"
import { getTheme, setTheme } from "@/utils/theme"

export default function ThemeToggle() {
    return (
        <button
            onClick={() => setTheme(getTheme() === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="flex size-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-zinc-300 bg-zinc-100 text-neutral-600 transition-transform hover:bg-zinc-300 active:scale-[.97] dark:border-zinc-800 dark:bg-zinc-900 dark:text-neutral-200 dark:hover:bg-zinc-800"
        >
            <Sun size={16} className="hidden dark:block" />
            <Moon size={16} className="block dark:hidden" />
        </button>
    )
}
