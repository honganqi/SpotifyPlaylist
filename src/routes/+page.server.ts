import type { PageServerLoad } from "./$types.js";
import { env } from "$env/dynamic/private";

function createLink() {
    const base = 'https://accounts.spotify.com/authorize?';
    const state = 'abcdefghijklmnop';
    const scope = 'user-read-private user-read-email playlist-read-collaborative playlist-read-private playlist-modify-public playlist-modify-private';

    const args = {
        response_type: 'code',
        client_id: env.SPOTIFY_CLIENT_ID,
        scope,
        redirect_uri: env.REDIRECT_URI,
        state
    }
    const argString = Object.entries(args).map(([key, val]) => `${key}=${encodeURIComponent(val)}`).join('&');

    const stringified = base + argString;

    return stringified;
}

export const load: PageServerLoad = ({ cookies }) => {
    const authLink = cookies.get('access_token') ? null : createLink();
    return  {
        authLink
    }
}