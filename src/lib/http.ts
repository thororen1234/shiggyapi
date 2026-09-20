import { CORS } from "./cors"

export const CACHE = {
    immutable: "public, max-age=86400, immutable",
    short: "public, max-age=3600",
    none: "no-store",
}

export class HttpError extends Error {
    constructor(
        public status: number,
        message: string,
    ) {
        super(message)
    }
}

export function fail(e: unknown): Response {
    if (e instanceof HttpError) {
        return Response.json(
            { message: e.message },
            { status: e.status, headers: CORS },
        )
    }

    console.error(e)
    return Response.json(
        { message: "Internal error" },
        { status: 500, headers: CORS },
    )
}

function image(type: string, data: Buffer, cache: string): Response {
    return new Response(new Uint8Array(data), {
        headers: {
            ...CORS,
            "Content-Type": type,
            "Cache-Control": cache,
        },
    })
}

export const png = (data: Buffer, cache: string) =>
    image("image/png", data, cache)

export const gif = (data: Buffer, cache: string) =>
    image("image/gif", data, cache)
