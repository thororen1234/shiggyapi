import Box from "@/components/Base/Box"
import Tag from "@/components/Base/Tag"
import { effects, endpoints } from "@/consts"

export default function Endpoints() {
    return (
        <Box compact className="divide-y divide-zinc-300 dark:divide-zinc-800">
            {endpoints.map(({ path, href, description, params }) => (
                <div
                    key={path}
                    className="flex flex-col gap-1 py-3 first:pt-0 sm:flex-row sm:items-center sm:gap-4"
                >
                    <span className="flex items-center gap-2 sm:w-60 sm:shrink-0">
                        <Tag className="text-emerald-700 dark:text-emerald-400">
                            GET
                        </Tag>
                        {href ? (
                            <a
                                href={href}
                                className="font-mono text-sm transition-colors hover:text-rose-500"
                            >
                                {path}
                            </a>
                        ) : (
                            <code className="font-mono text-sm">{path}</code>
                        )}
                    </span>

                    <p className="text-sm text-neutral-500 dark:text-neutral-400">
                        {description}
                        {params && (
                            <>
                                {" "}
                                <code className="font-mono text-xs">
                                    ?{params}
                                </code>
                            </>
                        )}
                    </p>
                </div>
            ))}

            <p className="pt-3 text-sm text-neutral-500 dark:text-neutral-400">
                Every image route also takes effects such as{" "}
                {effects.map((effect, i) => (
                    <span key={effect}>
                        {i > 0 && ", "}
                        <code className="font-mono text-xs">{effect}</code>
                    </span>
                ))}
                , for example{" "}
                <a
                    href="/image/random?size=256&grayscale=1"
                    className="font-mono text-xs underline"
                >
                    /image/random?size=256&amp;grayscale=1
                </a>
                .
            </p>
        </Box>
    )
}
