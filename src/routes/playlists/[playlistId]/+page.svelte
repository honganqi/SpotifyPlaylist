<script lang="ts">
	import { page } from '$app/stores';
    import { ArrowDownUpIcon, RefreshCcw } from '@lucide/svelte';
    import { Progress } from '@skeletonlabs/skeleton-svelte';
    
    let tracks = $state([]);
    let { data } = $props();
    tracks = data.tracks;

    const itemsPromise = Promise.resolve(tracks);
    const playlistId = $page.params.playlistId;

    let loading = $state(false);

	async function sortTracks() {
        loading = true;
		const res = await fetch(`/playlists/${playlistId}/sort.json`);
		const data = await res.json();
		tracks = data;
        loading = false;
	}

    async function resetTracks() {
        loading = true;
        const res = await fetch(`/playlists/${playlistId}/reset.json`);
        const data = await res.json();
        tracks = data;
        loading = false;
    }

    let simpleMode = $state(false);
</script>

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

{#await itemsPromise}
<div id="loadingOverlay">
<Progress class="flex justify-center items-center z-10 top-1/2 left-1/2" value={null}>
	<Progress.Circle>
		<Progress.CircleTrack />
		<Progress.CircleRange />
	</Progress.Circle>
	<Progress.ValueText />
</Progress>
</div>
<h2>Fetching data</h2>
{/await}

{#if loading}
<div id="loadingOverlay">
<Progress class="flex justify-center items-center z-10 top-1/2 left-1/2" value={null}>
	<Progress.Circle>
		<Progress.CircleTrack />
		<Progress.CircleRange />
	</Progress.Circle>
	<Progress.ValueText />
</Progress>
</div>
{/if}


{#if tracks}
<button type="button" class="btn btn-sm preset-filled-surface-500" onclick={() => (simpleMode = !simpleMode)}>
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

<button class="btn btn-sm preset-filled" type="button" onclick={sortTracks}><ArrowDownUpIcon class="size-5" /> Sort</button>
<button class="btn btn-sm preset-filled" type="button" onclick={resetTracks}><RefreshCcw class="size-5" /> Reset</button>

<div class="p-4 rounded text-surface bg-primary-50-950">
    <span class="badge preset-filled"><ArrowDownUpIcon class="size-5" /> Sort</span> the playlist in the following order:
    <ul class="list-inside list-decimal ms-4">
        <li>album's release date</li>
        <li>disc number in the album</li>
        <li>track number in the disc</li>
    </ul>
    <span class="badge preset-filled"><RefreshCcw class="size-5" /> Reset</span> the view to the original order in the playlist
</div>
{/if}


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