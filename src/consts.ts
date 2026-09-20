import { House, Images } from "lucide-react"
import type { Endpoint, NavLink } from "./types"

export const navLinks: NavLink[] = [
    { text: "Home", href: "/", icon: House },
    { text: "Gallery", href: "/view", icon: Images },
]

export const endpoints: Endpoint[] = [
    {
        path: "/image/random",
        href: "/image/random",
        description: "Redirects to a random image.",
    },
    {
        path: "/image/{filename}",
        description: "A specific image, served as a PNG.",
    },
    {
        path: "/text/{filename}",
        href: "/text/random?top=shiggy&bottom=time",
        description: "Adds text. Use random as the filename for any image.",
        params: "top, bottom",
    },
    {
        path: "/overlay/{filename}",
        description: "Puts an image from a URL on top of a Shiggy.",
        params: "url, x, y, scale, opacity",
    },
    {
        path: "/petpet/{filename}",
        href: "/petpet/random?size=256",
        description: "A looping GIF of a Shiggy getting pet.",
        params: "delay",
    },
    {
        path: "/api/random",
        href: "/api/random",
        description: "JSON with the filename and URL of a random image.",
    },
    {
        path: "/api/images",
        href: "/api/images",
        description: "JSON list of every available filename.",
    },
    {
        path: "/ping",
        href: "/ping",
        description: "Health check, responds with pong.",
    },
]

export const effects = [
    "size",
    "rotate",
    "flip",
    "flop",
    "grayscale",
    "invert",
    "blur",
]
