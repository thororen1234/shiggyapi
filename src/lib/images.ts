import fs from "fs"
import path from "path"
import { HttpError } from "./http"

export const POSTS_DIR = path.resolve("posts")
export const CHECKED_FILE = path.resolve("checked.json")

export function getImages(): string[] {
    if (!fs.existsSync(POSTS_DIR)) return []
    return fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith(".png"))
}

export function randomShiggy(): string | null {
    const files = getImages()
    if (!files.length) return null
    return files[Math.floor(Math.random() * files.length)]
}

export function resolveFilename(name: string): string {
    if (name === "random") {
        const file = randomShiggy()
        if (!file) throw new HttpError(404, "No images found")
        return file
    }

    if (name.includes("/") || name.includes("..") || !name.endsWith(".png")) {
        throw new HttpError(400, "Bad request")
    }
    if (!fs.existsSync(path.join(POSTS_DIR, name))) {
        throw new HttpError(404, "Not found")
    }

    return name
}
