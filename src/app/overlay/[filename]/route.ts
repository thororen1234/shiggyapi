import sharp from "sharp"
import { parseEffects } from "@/lib/effects"
import { CACHE, HttpError, fail, png } from "@/lib/http"
import { num, text } from "@/lib/params"
import { fetchRemoteImage } from "@/lib/remote-image"
import { renderBase } from "@/lib/render"

const FORMATS = ["png", "jpeg", "webp", "gif", "avif"]
const clamp = (n: number, min: number, max: number) =>
    Math.min(Math.max(n, min), max)

export async function GET(
    request: Request,
    { params }: { params: Promise<{ filename: string }> },
) {
    try {
        const { filename } = await params
        const query = new URL(request.url).searchParams

        const raw = text(query, "url", 2048)
        if (!raw) throw new HttpError(400, "Provide a url")

        let target: URL
        try {
            target = new URL(raw)
        } catch {
            throw new HttpError(400, "url is not valid")
        }

        // x and y are where the middle of the overlay goes, in percent
        const x = num(query, "x", 0, 100) ?? 50
        const y = num(query, "y", 0, 100) ?? 50
        const scale = num(query, "scale", 1, 100) ?? 40
        const opacity = num(query, "opacity", 0, 100) ?? 100

        const base = await renderBase(filename, parseEffects(query))
        const source = sharp(await fetchRemoteImage(target), {
            limitInputPixels: 25_000_000,
        })

        let piece: { data: Buffer; info: sharp.OutputInfo }
        try {
            const { format } = await source.metadata()
            if (!format || !FORMATS.includes(format)) throw new Error()

            piece = await source
                .rotate()
                .resize({
                    width: Math.max(1, Math.round((base.width * scale) / 100)),
                    height: base.height,
                    fit: "inside",
                })
                .ensureAlpha()
                .png()
                .toBuffer({ resolveWithObject: true })

            // sharp runs linear before ensureAlpha in one pipeline, so it needs its own pass
            if (opacity < 100) {
                piece = await sharp(piece.data)
                    .linear([1, 1, 1, opacity / 100], [0, 0, 0, 0])
                    .png()
                    .toBuffer({ resolveWithObject: true })
            }
        } catch {
            throw new HttpError(422, "url is not a supported image")
        }

        const left = clamp(
            Math.round((base.width * x) / 100 - piece.info.width / 2),
            0,
            base.width - piece.info.width,
        )
        const top = clamp(
            Math.round((base.height * y) / 100 - piece.info.height / 2),
            0,
            base.height - piece.info.height,
        )

        const data = await sharp(base.data)
            .composite([{ input: piece.data, left, top }])
            .png()
            .toBuffer()

        return png(data, base.random ? CACHE.none : CACHE.short)
    } catch (e) {
        return fail(e)
    }
}
