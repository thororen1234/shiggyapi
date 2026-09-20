export type Theme = "light" | "dark"

export function getTheme(): Theme {
    const stored = localStorage.getItem("theme") as Theme | null

    if (stored === "light" || stored === "dark") {
        return stored
    }

    const systemPrefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)",
    ).matches
    const defaultTheme: Theme = systemPrefersDark ? "dark" : "light"

    localStorage.setItem("theme", defaultTheme)
    return defaultTheme
}

export function setTheme(theme: Theme): Theme {
    const currentTheme = getTheme()

    if (theme === currentTheme) return theme

    localStorage.setItem("theme", theme)
    document.documentElement.setAttribute("data-theme", theme)

    return theme
}
