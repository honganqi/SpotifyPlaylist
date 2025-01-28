import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    // cookies: access_token, expiry_date
    //event.cookies.delete('access_token', { path: '/' });
    event.locals.access_token = event.cookies.get('access_token');
    event.locals.owner = event.cookies.get('owner');
    if (event.url.pathname.startsWith('/custom')) {
        return new Response('custom response');
    }

    const response = await resolve(event);
    return response;
}