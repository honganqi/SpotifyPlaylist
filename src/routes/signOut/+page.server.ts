import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types.js";

export const load: PageServerLoad = async ({ locals, cookies }) => {
    cookies.delete('access_token', { path: '/' });
    cookies.delete('owner', { path: '/' });
    locals.access_token = '';
    locals.owner = '';
    throw redirect(302,'/');
    return {
        signedOut: true
    }
}