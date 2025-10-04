import type { PageServerLoad } from "./$types.js";
import type { Actions } from "./$types.js";
import * as playlist from "$lib/server/playlist.js";

export const actions: Actions = {
    sort: async ({ params }) => {
        playlist.sort(params.playlistId);
    },
    reset: async ({ params }) => {
        playlist.reset(params.playlistId, true);
    }
} satisfies Actions;

export const load: PageServerLoad = async ({ locals, params }) => {
    return await playlist.getInfo(params.playlistId, true, locals.access_token);
}