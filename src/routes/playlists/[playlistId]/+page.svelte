<script lang="ts">
	import { enhance } from '$app/forms';
    import { ProgressRing } from '@skeletonlabs/skeleton-svelte';
    
    let { data } = $props();
    let formIsWorking = $state(false);
    let simpleMode = $state(false);
    let currentAlbum = '';


</script>


<div class="playlist-info">
    <img src={data.info.image} class="playlist-thumb" alt="thumbnail" />
    <div>
        <h1 class="text-4xl">{data.info.name}</h1>
        by <a href={data.info.ownerUrl}>{data.info.ownerName}</a>            
    </div>
</div>

<button type="button" class="btn preset-filled-surface-500" onclick={() => (simpleMode = !simpleMode)}>
    {#if simpleMode}
    Switch to full view
    {:else}
    Switch to simple view
    {/if}
</button>

{#await data.tracks}
<div id="loadingOverlay">
    <ProgressRing value={null} size="size-14" meterStroke="stroke-primary-600-400" trackStroke="stroke-primary-50-950" />
</div>
<h2>Fetching data</h2>
{:then}


<ol>
{#each data.tracks as track, index}
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
{/await}

{#if formIsWorking}
<div id="loadingOverlay">
    <ProgressRing value={null} size="size-14" meterStroke="stroke-primary-600-400" trackStroke="stroke-primary-50-950" />
</div>
{/if}

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