
import type { PageServerLoad } from "./$types.js";
import { getAllGenshin } from "$lib/server/playlist.js";
import { playlistIds } from "$lib/data/playlists.js";

export const load: PageServerLoad = async ({ locals }) => {
	// get all Genshin playlists for this demo...
	const items = await getAllGenshin(playlistIds, locals.access_token);

	return {
		items
	}
}