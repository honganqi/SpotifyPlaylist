import type { PageServerLoad } from "./$types.js";
import { getAll } from "$lib/server/playlist.js";

export const load: PageServerLoad = async ({ locals }) => {
	const data = await getAll(locals.access_token);
	const items = data.filter((item) => {
		if (item && item.ownerName === locals.owner) {
			return item;
		}
	})

	return {
		items
	}
}