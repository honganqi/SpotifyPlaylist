
import type { PageServerLoad } from "./$types.js";
// import { getAll } from "$lib/server/playlist.js";
import { getAllGenshin } from "$lib/server/playlist.js";
import { playlistIds } from "$lib/data/playlists.js";

export const load: PageServerLoad = async ({ locals }) => {
	// get all Genshin playlists for this demo...
	const items = await getAllGenshin(playlistIds, locals.access_token);

	// ...instead of the user's playlists since there is no sign-in to Spotify
	// const data = await getAll(locals.access_token);
	// const items = data.filter((item) => {
	// 	if (item && item.ownerName === locals.owner) {
	// 		return item;
	// 	}
	// })
	

	return {
		items
	}
}