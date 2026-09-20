import fs from "fs"
import path from "path"
import { applyEffects, hasEffects, parseEffects } from "@/lib/effects"
import { CACHE, fail, png } from "@/lib/http"
import { POSTS_DIR, resolveFilename } from "@/lib/images"
import sharp from "sharp"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ filename: string }> },
) {
    try {
        const { filename } = await params
        const fx = parseEffects(new URL(request.url).searchParams)
        const filepath = path.join(POSTS_DIR, resolveFilename(filename))

        if (!hasEffects(fx))
            return png(fs.readFileSync(filepath), CACHE.immutable)

        const data = await applyEffects(sharp(filepath), fx).png().toBuffer()
        return png(data, CACHE.immutable)
    } catch (e) {
        return fail(e)
    }
}
