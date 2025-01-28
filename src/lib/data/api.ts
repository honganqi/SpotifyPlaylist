import { redirect } from "@sveltejs/kit";

export async function api(endpoint: string, token: string | undefined) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    const res = await fetch(endpoint, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    const data = await res.json();
    if (data.error && (data.error.message == "The access token expired" || data.error.message == "Invalid access token")) {
        throw redirect(302, '/signOut');
    }
    return data;
}