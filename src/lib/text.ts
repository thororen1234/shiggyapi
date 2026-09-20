const FONT = "Impact, Anton, 'Arial Black', 'DejaVu Sans', Arial, sans-serif"

const escape = (s: string) =>
    s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`)

function wrap(text: string, maxChars: number): string[] {
    const lines: string[] = []
    let line = ""

    for (const word of text.split(/\s+/)) {
        let chars = Array.from(word)

        while (chars.length > maxChars) {
            if (line) lines.push(line)
            line = ""
            lines.push(chars.slice(0, maxChars).join(""))
            chars = chars.slice(maxChars)
        }

        const rest = chars.join("")
        if (!rest) continue

        if (line && Array.from(line).length + 1 + chars.length > maxChars) {
            lines.push(line)
            line = rest
        } else {
            line = line ? `${line} ${rest}` : rest
        }
    }

    if (line) lines.push(line)
    return lines
}

function layout(text: string, width: number, maxHeight: number) {
    const upper = text.toUpperCase()
    const min = width / 24
    let size = width / 9

    while (true) {
        const maxChars = Math.max(1, Math.floor((width * 0.94) / (size * 0.62)))
        const lines = wrap(upper, maxChars)

        if (lines.length * size * 1.1 <= maxHeight || size <= min) {
            return { lines, size }
        }

        size = Math.max(min, size * 0.9)
    }
}

const line = (text: string, x: number, y: number, size: number) =>
    `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" font-weight="900" text-anchor="middle" fill="#fff" stroke="#000" stroke-width="${size * 0.14}" stroke-linejoin="round" paint-order="stroke">${escape(text)}</text>`

export function textSvg(
    top: string | undefined,
    bottom: string | undefined,
    width: number,
    height: number,
): Buffer {
    const margin = width * 0.03
    const parts: string[] = []

    if (top) {
        const { lines, size } = layout(top, width, height * 0.4)
        lines.forEach((text, i) => {
            const y = margin + size * 0.9 + i * size * 1.1
            parts.push(line(text, width / 2, y, size))
        })
    }

    if (bottom) {
        const { lines, size } = layout(bottom, width, height * 0.4)
        const last = height - margin - size * 0.2
        lines.forEach((text, i) => {
            const y = last - (lines.length - 1 - i) * size * 1.1
            parts.push(line(text, width / 2, y, size))
        })
    }

    return Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">${parts.join("")}</svg>`,
    )
}
