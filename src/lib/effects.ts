import type sharp from "sharp"
import { flag, num } from "./params"

export interface Effects {
    size?: number
    rotate?: number
    blur?: number
    flip: boolean
    flop: boolean
    grayscale: boolean
    invert: boolean
}

export function parseEffects(query: URLSearchParams): Effects {
    return {
        size: num(query, "size", 16, 1024, true),
        rotate: num(query, "rotate", -360, 360, true),
        blur: num(query, "blur", 0.3, 20),
        flip: flag(query, "flip"),
        flop: flag(query, "flop"),
        grayscale: flag(query, "grayscale"),
        invert: flag(query, "invert"),
    }
}

export function hasEffects(fx: Effects): boolean {
    return Object.values(fx).some(Boolean)
}

export function applyEffects(image: sharp.Sharp, fx: Effects): sharp.Sharp {
    if (fx.size) image = image.resize({ width: fx.size })
    if (fx.flip) image = image.flip()
    if (fx.flop) image = image.flop()
    if (fx.rotate) {
        image = image.rotate(fx.rotate, {
            background: { r: 0, g: 0, b: 0, alpha: 0 },
        })
    }
    if (fx.grayscale) image = image.grayscale()
    if (fx.invert) image = image.negate({ alpha: false })
    if (fx.blur) image = image.blur(fx.blur)
    return image
}
