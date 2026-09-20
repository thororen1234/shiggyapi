import dns from "dns"
import http from "http"
import https from "https"
import net from "net"
import { HttpError } from "./http"

const MAX_BYTES = 5 * 1024 * 1024
const MAX_REDIRECTS = 3
const TIMEOUT_MS = 10_000

const blocked = new net.BlockList()
for (const [address, prefix] of [
    ["0.0.0.0", 8],
    ["10.0.0.0", 8],
    ["100.64.0.0", 10],
    ["127.0.0.0", 8],
    ["169.254.0.0", 16],
    ["172.16.0.0", 12],
    ["192.0.0.0", 24],
    ["192.168.0.0", 16],
    ["198.18.0.0", 15],
    ["224.0.0.0", 4],
    ["240.0.0.0", 4],
] as const) {
    blocked.addSubnet(address, prefix, "ipv4")
}
for (const [address, prefix] of [
    ["::", 128],
    ["::1", 128],
    ["64:ff9b::", 96],
    ["2001::", 32],
    ["2002::", 16],
    ["fc00::", 7],
    ["fe80::", 10],
    ["ff00::", 8],
] as const) {
    blocked.addSubnet(address, prefix, "ipv6")
}

function isBlocked(address: string): boolean {
    return blocked.check(address, net.isIPv6(address) ? "ipv6" : "ipv4")
}

const privateError = () =>
    new HttpError(400, "url must point to a public internet address")

const lookup: net.LookupFunction = (hostname, options, callback) => {
    dns.lookup(hostname, { ...options, all: true }, (err, addresses) => {
        if (err) return callback(err, "", 0)
        if (addresses.some((a) => isBlocked(a.address))) {
            return callback(privateError(), "", 0)
        }

        if (options.all) return callback(null, addresses)
        callback(null, addresses[0].address, addresses[0].family)
    })
}

function get(
    target: URL,
    redirects: number,
    signal: AbortSignal,
): Promise<Buffer> {
    return new Promise((resolve, reject) => {
        if (target.protocol !== "http:" && target.protocol !== "https:") {
            return reject(new HttpError(400, "url must be http or https"))
        }
        if (target.username || target.password) {
            return reject(
                new HttpError(400, "url must not contain credentials"),
            )
        }
        if (target.port && target.port !== "80" && target.port !== "443") {
            return reject(new HttpError(400, "url must use port 80 or 443"))
        }

        const host = target.hostname.replace(/^\[|\]$/g, "")
        if (net.isIP(host) && isBlocked(host)) return reject(privateError())

        const client = target.protocol === "https:" ? https : http
        const req = client.request(
            target,
            {
                method: "GET",
                headers: {
                    "User-Agent":
                        "shiggyapi/1.0 (https://github.com/thororen1234/shiggyapi)",
                    Accept: "image/*",
                },
                lookup,
                signal,
            },
            (res) => {
                const status = res.statusCode ?? 0
                const location = res.headers.location

                if (status >= 300 && status < 400 && location) {
                    res.resume()
                    if (redirects >= MAX_REDIRECTS) {
                        return reject(new HttpError(400, "too many redirects"))
                    }

                    let next: URL
                    try {
                        next = new URL(location, target)
                    } catch {
                        return reject(new HttpError(400, "bad redirect"))
                    }

                    return get(next, redirects + 1, signal).then(
                        resolve,
                        reject,
                    )
                }

                if (status !== 200) {
                    res.resume()
                    return reject(
                        new HttpError(
                            400,
                            `url responded with status ${status}`,
                        ),
                    )
                }

                if (Number(res.headers["content-length"]) > MAX_BYTES) {
                    res.destroy()
                    return reject(new HttpError(413, "image is too large"))
                }

                const chunks: Buffer[] = []
                let total = 0

                res.on("data", (chunk: Buffer) => {
                    total += chunk.length
                    if (total > MAX_BYTES) {
                        res.destroy()
                        return reject(new HttpError(413, "image is too large"))
                    }
                    chunks.push(chunk)
                })
                res.on("end", () => resolve(Buffer.concat(chunks)))
                res.on("error", () =>
                    reject(new HttpError(400, "could not fetch url")),
                )
            },
        )

        req.on("error", (e) => {
            if (e instanceof HttpError) return reject(e)
            if (e.name === "AbortError") {
                return reject(new HttpError(504, "timed out fetching url"))
            }
            reject(new HttpError(400, "could not fetch url"))
        })
        req.end()
    })
}

export function fetchRemoteImage(target: URL): Promise<Buffer> {
    return get(target, 0, AbortSignal.timeout(TIMEOUT_MS))
}
