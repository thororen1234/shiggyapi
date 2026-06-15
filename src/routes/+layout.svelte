<script>
    import '../app.css';

    let { children, data } = $props();
</script>

<svelte:head>
    {#if data.favicon}
        <link rel="icon" href="/image/{data.favicon}" type="image/png" />
    {/if}
</svelte:head>

<nav>
    <a href="/" class="logo">The Shiggy API</a>
    <a href="/view" class="nav-link">View All</a>
</nav>

<main>
    {@render children()}
</main>
