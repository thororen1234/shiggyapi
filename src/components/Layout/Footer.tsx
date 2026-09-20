export default function Footer() {
    return (
        <footer className="flex items-center justify-between gap-4 px-3 py-12 text-sm">
            <span className="text-neutral-600 dark:text-neutral-400">
                © {new Date().getFullYear()} thororen
            </span>

            <p className="text-neutral-600 dark:text-neutral-400">
                Images from{" "}
                <a
                    href="https://danbooru.donmai.us/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline"
                >
                    Danbooru
                </a>
                .
            </p>
        </footer>
    )
}
