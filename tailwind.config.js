import containerQueries from '@tailwindcss/container-queries';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton, contentPath } from '@skeletonlabs/skeleton/plugin';
import * as themes from '@skeletonlabs/skeleton/themes';

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		contentPath(import.meta.url, 'svelte')
	],

	theme: {
		extend: {}
	},

	plugins: [
		typography,
		forms,
		containerQueries,
		skeleton({
            // NOTE: each theme included will be added to your CSS bundle
            themes: [
				themes.catppuccin,
				themes.cerberus,
				themes.concord,
				themes.crimson,
				themes.fennec,
				themes.hamlindigo,
				themes.legacy,
				themes.mint,
				themes.modern,
				themes.mona,
				themes.nosh,
				themes.nouveau,
				themes.pine,
				themes.reign,
				themes.rocket,
				themes.rose,
				themes.sahara,
				themes.seafoam,
				themes.terminus,
				themes.vintage,
				themes.vox,
				themes.wintry
			]
        })
	]
}
