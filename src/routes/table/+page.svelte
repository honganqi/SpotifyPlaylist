<script>
    import { Progress } from '@skeletonlabs/skeleton-svelte';

    let { data } = $props();

    /**
     * To-Do:
     * - filter checklist by playlist
    */

</script>

<h1 class="h2">Comparison Table</h1>

{#if data.error}
{#if data.error == "no-items"}
<div class="p-4 rounded text-surface-100-900 bg-warning-200-800">
    <h2>No playlists found</h2>
    Please add some in <strong>/src/lib/data/playlists.js</strong> in the form of an array of objects with the "name" and "id" properties. For example:
    <pre class="rounded text-surface-900-100 bg-surface-200-800">
    const playlistIds = [
        {'{'} name: "Playlist1", id: "10928730981jasd" {'}'},
        {'{'} name: "Another one", id: "asd232f23rqc1jagg" {'}'},
        {'{'} name: "Super loops", id: "123123123123123as" {'}'},
    ]
    </pre>    
</div>
{/if}
{/if}
{#await data.tracks}
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
{:then}
{#if data.tracks}
<div class="h-full">
    <table class="table">
        <thead class="sticky top-0">
            <tr>
                <th></th>
                {#each data.playlists as playlistItem}
                    {#if playlistItem.id != "4DMCvxOyFqjIZouFX0lWhF"}
                    <th><a href="/playlists/{playlistItem.id}">{playlistItem.name}</a></th>
                    {/if}
                {/each}
            </tr>
        </thead>
        <tbody class="[&>tr]:hover:preset-tonal-primary">
            {#each data.tracks as track, index}
            <tr>
                <td>
                    <div>{index + 1}</div>
                    <div><img src={track.image} alt="album art" class="album-art" /></div>
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
                </td>
                {#each data.playlists as playlistItem}
                {#if playlistItem.id != "4DMCvxOyFqjIZouFX0lWhF"}
                <td class="text-center">{data.checklist[track.uri] && data.checklist[track.uri][playlistItem.id] ? "💟" : ""}</td>
                {/if}
                {/each}
            </tr>
            {/each}
        </tbody>
    </table>
</div>
{/if}
{/await}

<style>
.table th { text-align: center; color: #fff; font-weight: bold; }
tbody td { border-width: 1px; border-color: rgba(255, 255, 255, 0.3); }
tbody td > div { display: inline-block; margin-right: 10px; vertical-align: middle; }
.album-art { border-radius: 6px; }
.track-name { font-size: 1.3em; font-weight: bold; }
.track-info { font-size: 0.9rem; }
.track-release { font-size: 0.8em; opacity: 0.6; }
</style>