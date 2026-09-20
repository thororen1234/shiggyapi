import { CORS } from "@/lib/cors"
import { fail } from "@/lib/http"
import { resolveFilename } from "@/lib/images"

export const dynamic = "force-dynamic"

export function GET(request: Request) {
    try {
        const filename = resolveFilename("random")
        const { search } = new URL(request.url)

        return new Response(null, {
            status: 302,
            headers: { ...CORS, Location: `/image/${filename}${search}` },
        })
    } catch (e) {
        return fail(e)
    }
}
