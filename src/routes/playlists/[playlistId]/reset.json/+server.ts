import * as playlist from "$lib/server/playlist.js";

export const GET = async ({ params }) => {
	const playlistId = params.playlistId;

	const data = await playlist.reset(playlistId, true);

	return new Response(JSON.stringify(data?.tracks), {
		headers: { 'Content-Type': 'application/json' }
	});
};
