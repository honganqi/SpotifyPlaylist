import type { PageServerLoad } from "./$types.js";
import * as playlist from "$lib/server/playlist.js";
import { playlistIds } from "$lib/data/playlists.js";

async function fetchAllPlaylists(playlistIds, access_token) {
    // Create an array of promises
    const fetchPromises = playlistIds.map(async (playlistItem) => {
        const info = await playlist.getInfo(playlistItem.id, access_token);
        if (playlistItem.id == "4DMCvxOyFqjIZouFX0lWhF") {
            playlist.sort(playlistItem.id)
        }
        return { name: playlistItem.name, id: playlistItem.id, info: info.info, tracks: info.tracks }; // Merge the info with original data
    });

    let checklist = {};
    let tracks = [];
    // Wait for all promises to resolve
    const results = await Promise.all(fetchPromises);
    results.map(playlistItem => {
        if (playlistItem.id == "4DMCvxOyFqjIZouFX0lWhF") {
            tracks = playlistItem.tracks;
        } else {
            playlistItem.tracks.map(track => {
                (checklist[track.uri] ??= {})[playlistItem.id] ??= playlistItem.id;
                checklist[track.uri][playlistItem.id] = playlistItem.id
            })
        }
    });

    return {
        tracks,
        checklist
    }
}

export const load: PageServerLoad = async ({ locals, params }) => {
    if (playlistIds.length) {
        console.log(playlistIds);
    
        const trackChecklist = await fetchAllPlaylists(playlistIds, locals.access_token);
    
        return {
            playlists: playlistIds,
            tracks: trackChecklist.tracks,
            checklist: trackChecklist.checklist
        }
    }
    return {
        error: "no-items"
    }
}