<script>
    const { data } = $props();
</script>

<svelte:head>
    <title>All Shiggy Images</title>
</svelte:head>

<div class="view">
    <header class="view-header">
        <h1>All Images ({data.files.length})</h1>
    </header>

    <div class="grid">
        {#each data.files as file (file)}
            <a href="/image/{file}" class="thumb" id="thumb-{file}">
                <img src="/image/{file}" alt={file} loading="lazy" />
            </a>
        {/each}
    </div>
</div>

<style>
    .view {
        padding: 2.5rem 2rem;
        max-width: 1400px;
        margin: 0 auto;
        width: 100%;
    }

    .view-header {
        margin-bottom: 2rem;
    }

    .view-header h1 {
        font-size: 1.4rem;
        font-weight: 600;
        letter-spacing: -0.02em;
        display: flex;
        align-items: baseline;
        gap: 0.5rem;
    }


    .grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(128px, 1fr));
        gap: 0.625rem;
    }

    .thumb {
        aspect-ratio: 1;
        border-radius: 8px;
        overflow: hidden;
        border: 1px solid var(--border);
        background: var(--bg-1);
        transition:
            transform 0.2s ease,
            box-shadow 0.2s ease,
            border-color 0.2s ease;
        display: block;
    }

    .thumb:hover {
        transform: scale(1.05);
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.5);
        border-color: rgba(139, 124, 247, 0.4);
    }

    .thumb img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
    }
</style>
