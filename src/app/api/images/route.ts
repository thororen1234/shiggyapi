import { CORS } from "@/lib/cors"
import { getImages } from "@/lib/images"

export const dynamic = "force-dynamic"

export function GET() {
    return Response.json(getImages(), { headers: CORS })
}
