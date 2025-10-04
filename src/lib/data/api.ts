import { redirect } from "@sveltejs/kit";

export async function api(endpoint: string, token: string | undefined) {
    const res = await fetch(endpoint, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    const data = await res.json();
    if (data.error && (data.error.message == "The access token expired" || data.error.message == "Invalid access token")) {
        //throw redirect(302, '/signOut');  // disable auto-sign out for this demo if not signed in to Spotify
        throw redirect(302, '/callback');
    }
    return data;
}