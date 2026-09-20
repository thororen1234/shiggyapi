import fs from "fs"
import path from "path"
import sharp from "sharp"
import type { Base } from "./render"

const FRAMES = 10
const SPRITE_FRAMES = 5
const SPRITE_SIZE = 112
const MAX_SIDE = 512

// hand sprite from https://benisland.neocities.org/petpet
const SPRITE_PATH = path.resolve("src/assets/petpet.png")
let sprite: Buffer | undefined

const clamp = (n: number, min: number, max: number) =>
    Math.min(Math.max(n, min), max)

function hands(size: number): Promise<Buffer[]> {
    sprite ??= fs.readFileSync(SPRITE_PATH)
    return Promise.all(
        Array.from({ length: SPRITE_FRAMES }, (_, i) =>
            sharp(sprite)
                .extract({
                    left: i * SPRITE_SIZE,
                    top: 0,
                    width: SPRITE_SIZE,
                    height: SPRITE_SIZE,
                })
                .resize(size, size)
                .toBuffer(),
        ),
    )
}

export async function renderPetpet(base: Base, delay: number): Promise<Buffer> {
    const size = Math.min(Math.max(base.width, base.height), MAX_SIDE)
    const box = Math.round(size * 0.8)

    const { data, info } = await sharp(base.data)
        .resize({ width: box, height: box, fit: "inside" })
        .toBuffer({ resolveWithObject: true })
    const overlays = await hands(size)

    const frames: Buffer[] = []
    for (let i = 0; i < FRAMES; i++) {
        const squeeze = i < FRAMES / 2 ? i : FRAMES - i

        const w = Math.max(1, Math.round(info.width * (1 + squeeze * 0.025)))
        const h = Math.max(1, Math.round(info.height * (1 - squeeze * 0.0625)))
        const piece = await sharp(data).resize(w, h, { fit: "fill" }).toBuffer()

        const left = clamp(Math.round(size * 0.6 - w / 2), 0, size - w)
        const top = clamp(Math.round(size * 0.92 - h), 0, size - h)

        const frame = await sharp({
            create: {
                width: size,
                height: size,
                channels: 4,
                background: { r: 0, g: 0, b: 0, alpha: 0 },
            },
        })
            .composite([
                { input: piece, left, top },
                { input: overlays[Math.floor(i / 2)] },
            ])
            .raw()
            .toBuffer()
        frames.push(frame)
    }

    return sharp(Buffer.concat(frames), {
        raw: {
            width: size,
            height: size * FRAMES,
            channels: 4,
            pageHeight: size,
        },
    })
        .gif({ delay: Array(FRAMES).fill(delay), loop: 0 })
        .toBuffer()
}
