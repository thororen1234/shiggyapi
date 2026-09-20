export async function register() {
    if (process.env.NEXT_RUNTIME !== "nodejs") return

    const { scrapeImages } = await import("./lib/scraper")
    scrapeImages().catch((e) => console.error("Scraper failed:", e))
}
