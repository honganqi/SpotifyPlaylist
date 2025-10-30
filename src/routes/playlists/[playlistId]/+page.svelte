<script lang="ts">
	import { enhance } from '$app/forms';
    import { Modal, ProgressRing } from '@skeletonlabs/skeleton-svelte';
    
    let { data } = $props();
    const { tracks } = data;

    const itemsPromise = Promise.resolve(tracks);

    // // Simulate a 3-second async fetch
	// const itemsPromise = new Promise((resolve) => {
	// 	setTimeout(() => {
	// 		resolve([
	// 			{ id: 1, name: "Playlist One" },
	// 			{ id: 2, name: "Playlist Two" },
	// 			{ id: 3, name: "Playlist Three" }
	// 		]);
	// 	}, 3000);
	// });

    let simpleMode = $state(false);
</script>

{#await itemsPromise}
    <Modal
    open={true}
    onOpenChange={(e) => (openState = e.open)}
    triggerBase="btn preset-tonal"
    contentBase="bg-none max-w-screen-sm"
    backdropClasses="backdrop-blur-sm"
    trapFocus={false}
    >
    {#snippet content()}
    <ProgressRing value={null} size="size-36" meterStroke="stroke-primary-600-400" trackStroke="stroke-primary-50-950" strokeWidth="20px" />
    {/snippet}
    </Modal>
<h2>Fetching data</h2>
{:then tracks}
<!-- <div class="playlist-info">
    <img src={data.info.image} class="playlist-thumb" alt="thumbnail" />
    <div>
        <h1 class="text-4xl">{data.info.name}</h1>
        by <a href={data.info.ownerUrl}>{data.info.ownerName}</a>            
    </div>
</div> -->

<iframe
    title="Spotify Player"
    data-testid="embed-iframe"
    style="border-radius:12px"
    src="https://open.spotify.com/embed/playlist/{data.info.id}?utm_source=generator"
    width="100%"
    height="352"
    frameBorder="0"
    allowfullscreen="{true}"
    allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
    loading="lazy">
</iframe>

<button type="button" class="btn preset-filled-surface-500" onclick={() => (simpleMode = !simpleMode)}>
    {#if simpleMode}
    Switch to full view
    {:else}
    Switch to simple view
    {/if}
</button>

<ol>
{#each tracks as track, index}
    <!-- useful if playlist is split by albums
    {#if currentAlbum != track.album}
    {currentAlbum = track.album}
    {/if}
    -->
    <li>
        {#if simpleMode}
        {index + 1}. {track.title}
        {:else}
        <span class="index">{index + 1}</span>
        <img src={track.image} alt="album art" />
        <div class="track-info">
            <div class="track-name">{track.title}</div>
            <div class="track-artist">by {track.artist}</div>
            <div class="track-album">
                {track.album} <span class="track-release">{track.release_date}</span>
            </div>
            <div>
                <small>Track {track.track_number} of {track.track_total} (Disc {track.disc_number})</small>
            </div>
        </div>
        {/if}
    </li>
{/each}
</ol>

<form method="POST" action="?/sort" use:enhance>
    <button class="btn preset-filled" formaction="?/sort">Sort</button>
    <button class="btn preset-filled" formaction="?/reset">Reset</button>
</form>

<div class="p-4 rounded text-surface bg-primary-200-800">
    <span class="badge preset-filled">Sort</span> the playlist in the following order:
    <ul class="list-inside list-decimal ms-4">
        <li>album's release date</li>
        <li>disc number in the album</li>
        <li>track number in the disc</li>
    </ul>
    <span class="badge preset-filled">Reset</span> the view to the original order in the playlist
</div>


{:catch error}
    <p>Error: {error.message}</p>
{/await}


<style>
    .index { vertical-align: middle; }
    .playlist-thumb { height: 200px; }
    .playlist-info { display: flex; gap: 1rem; align-items: last baseline; }
    ol { list-style: decimal; }
    ol li { padding: 0.5rem 0; display: flex; gap: 0.3rem; }
    ol li img { display: inline-block; border-radius: 8px; margin-right: 8px; height: 100px; }
    .track-name { font-size: 1.3em; font-weight: bold; }
    .track-info { font-size: 0.9rem; }
    .track-release { font-size: 0.8em; opacity: 0.6; }
</style>