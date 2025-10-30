import * as playlist from "$lib/server/playlist.js";

export const GET = async ({ params }) => {
	const playlistId = params.playlistId;

	const data = await playlist.sort(playlistId);

	return new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' }
	});
};
