<script>
	import { goto } from "$app/navigation";
	import { Combobox } from "@skeletonlabs/skeleton-svelte";

    const { data } = $props();
    const { items } = data;

    const searchPlaylist = items.map(playlistItem => {
        return {
            label: playlistItem.name,
            value: playlistItem.id
        }
    });

    function goToPlaylist(e) {
        goto(`/playlists/${e.value}`);
    }
</script>

<h1>Playlists</h1>
<Combobox data={searchPlaylist} placeholder="Search" onValueChange={goToPlaylist} openOnClick inputGroupClasses="mt-4 bg-surface-900" />
{#if items}
<ul id="playlists">
{#each items as playlistItem}
    <li class="hover:bg-surface-900">
        <a href="/playlists/{playlistItem.id}">
            {#if playlistItem.image}
            <img src={playlistItem.image} alt="thumbnail" class="rounded-md" />
            {:else}
            <span class="placeholder"></span>
            {/if}
            <div>
                <div class="title">{playlistItem.name}</div>
                <div class="subtitle">Total tracks: {playlistItem.total}</div>
            </div>
        </a>
    </li>
{/each}
</ul>
{/if}

<style>
#playlists { font-size: 1.2rem; }
li { border-radius: 15px; }
li > a { padding: 10px; display: block; }
li img, li .placeholder { width: 50px; height: 50px; display: inline-block; margin-right: 10px; vertical-align: middle; }
a > div { display: inline-block; vertical-align: middle; }
.title { font-weight: bold; }
.subtitle { font-size: 0.8rem; opacity: 0.8; }
</style>