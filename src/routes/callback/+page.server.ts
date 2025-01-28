import type { PageServerLoad } from "./$types.js";
import { env } from "$env/dynamic/private";
import { api } from "$lib/data/api.js";
import dotenv from 'dotenv';
import { readFile, writeFile } from 'fs/promises';
import { redirect } from "@sveltejs/kit";

// Authorization Code Flow
// https://developer.spotify.com/documentation/web-api/tutorials/code-flow
/**
 * 1. Check if session exists: /+page.server.ts
 * 2. Create authorization link: /+page.server.ts
 * 3. Display authorization link: /+page.svelte
 * 4. User clicks link
 * 5. User is sent back to callback page: /callback/
 * 6. Callback page checks return data: /callback/+page.server.ts
 * 7. Callback page requests for the token: /callback/+page.server.ts
 */

async function validateToken() {

}

async function refreshToken(refreshToken) {
    try {
        const res = await fetch('https://accounts.spotify.com/api/token', {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(env.SPOTIFY_CLIENT_ID + ':' + env.SPOTIFY_CLIENT_SECRET)
            },
            body: new URLSearchParams({
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
                client_id: env.SPOTIFY_CLIENT_ID
            })
        })
    
        const data = await res.json();
        if (data.error) {
            throw new Error(data.error + ': ' + data.error_description);
        }
        return {
            authenticated: true,
            access_token: data.access_token,
            refresh_token: data.refresh_token ? data.refresh_token : null
        }
    } catch (error) {
        return {
            authenticated: false,
            error: error.message
        }
    }
}

async function requestToken(code) {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    try {
        const res = await fetch('https://accounts.spotify.com/api/token', {
            method: "POST",
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(env.SPOTIFY_CLIENT_ID + ':' + env.SPOTIFY_CLIENT_SECRET)
            },
            body: new URLSearchParams({
                code,
                redirect_uri: env.REDIRECT_URI,
                grant_type: 'authorization_code'
            })
        })
    
        const data = await res.json();
        /**
         * returns:
         * - access_token
         * - token_type
         * - expires_in (seconds)
         * - refresh_token
         * - scope
         */
        if (data.error) {
            throw new Error(data.error + ': ' + data.error_description);
        }
        return {
            authenticated: true,
            access_token: data.access_token,
            refresh_token: data.refresh_token
        }
    }
    catch (error) {
        return {
            authenticated: false,
            error: error.message
        }
    }
}

export const load: PageServerLoad = async ({ params, url, cookies }) => {
    let returnData;
    if (url.searchParams) {
        returnData = url.searchParams;
        const code = returnData.get('code');

        /**
         * for this project, no need to check state because security is not needed (unpublised project)
         */
        const state = returnData.get('state');

        const refreshTokenEnv = env.REFRESH_TOKEN;
        if (refreshTokenEnv) {
            const data = await refreshToken(refreshTokenEnv);
            if (data.authenticated) {
                if (data.refresh_token) {
                    await updateEnvFile('REFRESH_TOKEN', data.refresh_token);
                }
                const meData = await api('https://api.spotify.com/v1/me', data.access_token);
                cookies.set('access_token', data.access_token, { path: '/' });
                cookies.set('owner', meData.display_name, { path: '/' });
                throw redirect(302, '/');
            }
        }

        const data = await requestToken(code);
        if (data.authenticated) {
            // update ENV file with refresh token
            await updateEnvFile('REFRESH_TOKEN', data.refresh_token);
            const meData = await api('https://api.spotify.com/v1/me', data.access_token);
            cookies.set('access_token', data.access_token, { path: '/' });
            cookies.set('owner', meData.display_name, { path: '/' });
            throw redirect(302, '/');
        }
        
        return { authenticated: false }
    }
}

async function updateEnvFile(key, value) {
    const envConfig = dotenv.parse(await readFile('.env'));
    envConfig[key] = value;
    
    const newEnvContent = Object.entries(envConfig)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    await writeFile('.env', newEnvContent);
}