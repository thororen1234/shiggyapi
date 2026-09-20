import path from "path"
import sharp from "sharp"
import { applyEffects, type Effects } from "./effects"
import { POSTS_DIR, resolveFilename } from "./images"

export interface Base {
    data: Buffer
    width: number
    height: number
    random: boolean
}

export async function renderBase(filename: string, fx: Effects): Promise<Base> {
    const file = resolveFilename(filename)
    const { data, info } = await applyEffects(
        sharp(path.join(POSTS_DIR, file)),
        fx,
    )
        .png()
        .toBuffer({ resolveWithObject: true })

    return {
        data,
        width: info.width,
        height: info.height,
        random: filename === "random",
    }
}
