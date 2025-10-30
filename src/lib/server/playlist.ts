import { api } from "$lib/data/api.js";

const playlist = new Map();

async function getTracks(nextUrl, access_token) {
    const result = await api(nextUrl, access_token); // Call your API function
    let tracks = result.items;
    if (result.next) {
        const next = await getTracks(result.next, access_token);
        tracks.push(...next.tracks);
    }

    return {
        tracks,
        next: result.next
    };
}

export async function getInfo(playlistId, includeTracks = false, access_token) {
    playlist.set('access_token', access_token);

    if (!playlist.get(playlistId) || (includeTracks && !playlist.get(playlistId).tracks)) {
        await reset(playlistId, includeTracks);
    }

    return playlist.get(playlistId);
}

export async function reset(playlistId, includeTracks = false) {
    const access_token = playlist.get('access_token');
    const playlistData = await api(`https://api.spotify.com/v1/playlists/${playlistId}`, access_token);
    const info = {
        id: playlistData.id,
        image: playlistData.images ? playlistData.images[0].url : '',
        name: playlistData.name,
        ownerUrl: playlistData.owner.href,
        ownerName: playlistData.owner.display_name,
        total: playlistData.tracks.total
    }

    if (!includeTracks) {
        playlist.set(playlistId, {
            info
        })

        return;
    }

    const tracksData = await getTracks(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, access_token).then(data => data.tracks);
    const tracks = tracksData.map(trackInfo => {
        return {
            title: trackInfo.track.name,
            image: trackInfo.track.album.images[2].url,
            artist: trackInfo.track.artists.map(artist => {
                return artist.name
            }).join(', '),
            album: trackInfo.track.album.name,
            track_number: trackInfo.track.track_number,
            track_total: trackInfo.track.album.total_tracks,
            disc_number: trackInfo.track.disc_number,
            release_date: trackInfo.track.album.release_date,
            uri: trackInfo.track.uri
        }
    })

    playlist.set(playlistId, {
        info,
        tracks
    })
    return {
        info,
        tracks
    };
}

export async function sort(playlistId) {
    if (!playlist) {
        console.log('not found')
    }
    if (!playlist.get(playlistId) || !playlist.get(playlistId).tracks) {
        console.log('sort: not set, getting')
        await reset(playlistId, true);
    }
    const { tracks } = playlist.get(playlistId);

    /**
     * format of relevant returned data:
     * (listed by sort priority)
     * track: {
     *     album: {
     *          release_date: date
     *     },
     *     disc_number: int,
     *     track_number: int
     * }
     */

    const sorted = [...tracks].sort((a, b) => {
        const dateA = new Date(a.release_date);
        const dateB = new Date(b.release_date);
        if (dateA.getTime() !== dateB.getTime()) return dateA.getTime() - dateB.getTime();
        if (a.disc_number !== b.disc_number) return a.disc_number - b.disc_number;
        return a.track_number - b.track_number;
    });

    const { info } = playlist.get(playlistId);

    playlist.set(playlistId, {
        info,
        tracks: sorted
    });

    console.log('sorted')
    
    return sorted;
}

export async function reorder() {
    /**
     * reference: https://developer.spotify.com/documentation/web-api/reference/reorder-or-replace-playlists-tracks
     * need a comma-separated list of track.uri values
     * method: PUT
     * uri: /playlists/{playlist_id}/tracks
     * body: {
     *   uris: array of strings,
     *   range_start: integer,
     *   insert_before: integer,
     *   range_length: integer
     * }
     */
}

export async function getAllGenshin(playlistIds, access_token) {
    // Create an array of promises
    const fetchPromises = playlistIds.map(async (playlistItem) => {
        const playlistObj = await getInfo(playlistItem.id, false, access_token);

        return {
            name: playlistObj.info.name,
            id: playlistObj.info.id,
            image: playlistObj.info.image,
            ownerUrl: playlistObj.info.ownerUrl,
            ownerName: playlistObj.info.ownerName,
            total: playlistObj.info.total
        };
    });



    // Wait for all promises to resolve
    const results = await Promise.all(fetchPromises);

    return results;
}