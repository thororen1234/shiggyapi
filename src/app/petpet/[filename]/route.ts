import { CORS } from "@/lib/cors"
import { parseEffects } from "@/lib/effects"
import { CACHE, fail, gif } from "@/lib/http"
import { resolveFilename } from "@/lib/images"
import { num } from "@/lib/params"
import { renderPetpet } from "@/lib/petpet"
import { renderBase } from "@/lib/render"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ filename: string }> },
) {
    try {
        const { filename } = await params
        const { search, searchParams: query } = new URL(request.url)

        if (filename === "random") {
            return new Response(null, {
                status: 302,
                headers: {
                    ...CORS,
                    Location: `/petpet/${resolveFilename("random")}${search}`,
                    "Cache-Control": CACHE.none,
                },
            })
        }

        const delay = num(query, "delay", 20, 500, true) ?? 20

        const base = await renderBase(filename, parseEffects(query))
        const data = await renderPetpet(base, delay)

        return gif(data, CACHE.immutable)
    } catch (e) {
        return fail(e)
    }
}
