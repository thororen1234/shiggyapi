<script>
    import { untrack } from 'svelte';

    const { data } = $props();

    let filename = $state(untrack(() => data.filename));
    let fetching = $state(false);

    const desc = $derived(`${data.total} random images of Shiggy and counting...`);

    async function anotherOne() {
        fetching = true;
        try {
            const res = await fetch('/api/random');
            const json = await res.json();
            filename = json.filename;
        } finally {
            fetching = false;
        }
    }
</script>

<svelte:head>
    <title>Shiggy</title>
    <meta property="og:title" content="The Shiggy API" />
    <meta property="og:description" content={desc} />
    <meta property="og:image" content="{data.origin}/image/{data.filename}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="{data.origin}/" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="The Shiggy API" />
    <meta name="twitter:description" content={desc} />
    <meta name="twitter:image" content="{data.origin}/image/{data.filename}" />
</svelte:head>

<div class="home">
    <img
        src="/image/{filename}"
        alt="Shiggy"
        class:loading={fetching}
        id="shiggy-img"
    />

    <div class="links">
        <a href="/image/{filename}" id="permalink-btn">Permalink</a>
        <button onclick={anotherOne} disabled={fetching} id="another-one-btn">
            {fetching ? '...' : 'Another One?'}
        </button>
        <a href="/view" id="view-all-btn">View All</a>
    </div>
</div>

<style>
    .home {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 1rem;
        padding: 1rem;
    }

    img {
        width: min(calc(100vh - 140px), 90vw);
        aspect-ratio: 1;
        object-fit: contain;
        border-radius: 8px;
    }

    img.loading {
        opacity: 0.5;
    }

    .links {
        display: flex;
        gap: 2rem;
        align-items: center;
        font-size: 1rem;
        margin-top: 0.5rem;
    }

    a {
        color: #aaa;
        text-decoration: none;
    }

    a:hover {
        color: #fff;
    }

    button {
        background: none;
        border: none;
        color: #aaa;
        padding: 0;
        cursor: pointer;
        font-size: 1rem;
    }

    button:hover:not(:disabled) {
        border-color: #888;
        color: #fff;
    }

    button:disabled {
        opacity: 0.4;
        cursor: default;
    }
</style>
