import { HttpError } from "./http"

export function flag(query: URLSearchParams, key: string): boolean {
    const value = query.get(key)
    return value !== null && value !== "0" && value !== "false"
}

export function num(
    query: URLSearchParams,
    key: string,
    min: number,
    max: number,
    integer = false,
): number | undefined {
    const raw = query.get(key)
    if (raw === null || raw.trim() === "") return undefined

    const value = Number(raw)
    if (!Number.isFinite(value) || value < min || value > max) {
        throw new HttpError(400, `${key} must be between ${min} and ${max}`)
    }

    return integer ? Math.round(value) : value
}

export function text(
    query: URLSearchParams,
    key: string,
    max = 200,
): string | undefined {
    const raw = query
        .get(key)
        ?.replace(/[\u0000-\u001f\u007f]/g, " ")
        .trim()
    if (!raw) return undefined

    if (raw.length > max) {
        throw new HttpError(400, `${key} must be at most ${max} characters`)
    }

    return raw
}
