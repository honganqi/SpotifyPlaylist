<script>
    const { data } = $props();
    const { authLink } = data;
</script>

{#if authLink}
<a href={authLink} class="btn preset-filled-success-500">Log in with Spotify</a>
{:else}
<div class="card preset-filled-surface-100-900 border-[1px] border-surface-200-800 w-full max-w-md p-4 text-center">Signed in</div>
{/if}