import sharp from "sharp"
import { parseEffects } from "@/lib/effects"
import { CACHE, HttpError, fail, png } from "@/lib/http"
import { textSvg } from "@/lib/text"
import { text } from "@/lib/params"
import { renderBase } from "@/lib/render"

export async function GET(
    request: Request,
    { params }: { params: Promise<{ filename: string }> },
) {
    try {
        const { filename } = await params
        const query = new URL(request.url).searchParams

        const top = text(query, "top")
        const bottom = text(query, "bottom")
        if (!top && !bottom) {
            throw new HttpError(400, "Provide top and/or bottom text")
        }

        const base = await renderBase(filename, parseEffects(query))
        const data = await sharp(base.data)
            .composite([
                { input: textSvg(top, bottom, base.width, base.height) },
            ])
            .png()
            .toBuffer()

        return png(data, base.random ? CACHE.none : CACHE.immutable)
    } catch (e) {
        return fail(e)
    }
}
