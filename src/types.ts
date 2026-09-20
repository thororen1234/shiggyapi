import type { LucideIcon } from "lucide-react"

export type Icon = LucideIcon

export interface NavLink {
    text: string
    href: string
    icon: Icon
}

export interface Endpoint {
    path: string
    href?: string
    description: string
    params?: string
}
