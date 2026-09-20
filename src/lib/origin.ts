import { headers } from "next/headers"

export async function getOrigin(): Promise<string> {
    if (process.env.ORIGIN) return process.env.ORIGIN.replace(/\/$/, "")

    const h = await headers()
    const host = h.get("x-forwarded-host") ?? h.get("host")
    const proto = (h.get("x-forwarded-proto") ?? "http").split(",")[0].trim()
    return `${proto}://${host}`
}
