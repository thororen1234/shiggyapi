import { CORS } from "@/lib/cors"
import { randomShiggy } from "@/lib/images"
import { getOrigin } from "@/lib/origin"

export const dynamic = "force-dynamic"

export async function GET() {
    const filename = randomShiggy()
    if (!filename) {
        return Response.json(
            { message: "No images found" },
            { status: 404, headers: CORS },
        )
    }

    const url = `${await getOrigin()}/image/${filename}`
    return Response.json({ filename, url }, { headers: CORS })
}
