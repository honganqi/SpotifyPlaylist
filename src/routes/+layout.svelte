<script lang="ts">
	import '../app.css';
	import { Switch, ToastProvider, Popover, Avatar } from '@skeletonlabs/skeleton-svelte';
	import { currentTheme } from '$lib/stores.js';
	import { onMount } from 'svelte';

	let { children, data } = $props();
	
	const themes = [
		{ type: 'catppuccin', name: 'Catppuccin', icon: '🐈' },
		{ type: 'cerberus', name: 'Cerberus', icon: '🐺' },
		{ type: 'concord', name: 'Concord', icon: '🤖' },
		{ type: 'crimson', name: 'Crimson', icon: '🩸' },
		{ type: 'fennec', name: 'Fennec', icon: '🦊' },
		{ type: 'hamlindigo', name: 'Hamlindigo', icon: '👔' },
		{ type: 'legacy', name: 'Legacy', icon: '💀' },
		{ type: 'mint', name: 'Mint', icon: '🍃' },
		{ type: 'modern', name: 'Modern', icon: '🌸' },
		{ type: 'mona', name: 'Mona', icon: '🐙' },
		{ type: 'nosh', name: 'Nosh', icon: '🥙' },
		{ type: 'nouveau', name: 'Nouveau', icon: '👑' },
		{ type: 'pine', name: 'Pine', icon: '🌲' },
		{ type: 'reign', name: 'Reign', icon: '📒' },
		{ type: 'rocket', name: 'Rocket', icon: '🚀' },
		{ type: 'rose', name: 'Rose', icon: '🌷' },
		{ type: 'sahara', name: 'Sahara', icon: '🏜️' },
		{ type: 'seafoam', name: 'Seafoam', icon: '🧜‍♀️' },
		{ type: 'terminus', name: 'Terminus', icon: '🌑' },
		{ type: 'vintage', name: 'Vintage', icon: '📺' },
		{ type: 'vox', name: 'Vox', icon: '👾' },
		{ type: 'wintry', name: 'Wintry', icon: '🌨️' }
	];

	let theme = $state(currentTheme);

	$effect(() => {
		document.body.setAttribute('data-theme', theme);
	})

	let darkMode = $state(false);

	onMount(() => {
		darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
	});
	
	$effect(() => {
		if (darkMode) {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	})
</script>

{#if !data.authLink}
<div class="grid h-screen grid-rows-[auto_1fr]">
	<!-- Header -->
	<header id="siteHeader" class="p-4 grid grid-cols-[auto_1fr_auto]">
		<h1><a href="/">Playlist Checker</a></h1>
		<div></div>
		<div>
			<Popover
			positioning={{ placement: 'top' }}
			contentBase="card bg-surface-900 p-4 space-y-4 max-w-[320px] min-w-[200px]"
			arrow
			arrowBackground="!bg-surface-900 dark:!bg-surface-900"
			>
			{#snippet trigger()}<Avatar name={data.username} size="size-10" />{/snippet}
			{#snippet content()}
			<ul id="popup" class="grid gap-4">
				<li><h1>{data.username}</h1></li>
				<div>
					Theme
					<select class="select" bind:value={theme}>
						{#each themes as { icon, name, type }}
							<option value={type}>{icon} {name}</option>
						{/each}
					</select>
				</div>
				<div class="flex justify-between items-center gap-4">
					Dark Mode
					<Switch name="darkMode" bind:checked={darkMode}></Switch>
				</div>
				<hr class="opacity-30">
				<li><a href="/signOut">Sign Out</a></li>
			</ul>
			{/snippet}
			</Popover>
		</div>
	</header>
	<ToastProvider>
		<!-- Grid Columns -->
		<div class="grid grid-cols-1 md:grid-cols-[auto_1fr]">
			<!-- Left Sidebar -->
			<aside class="p-2">
				<ul>
					<li><a href="/playlists">Playlists</a></li>
					<li><a href="/checker">Checker</a></li>
				</ul>
			</aside>
			<!-- Main Content -->
			<main class="space-y-4 bg-surface-800 p-4">
				{@render children()}
			</main>
		</div>
	</ToastProvider>
	<!-- Footer -->
	<!-- <footer class="bg-blue-500 p-4">(footer)</footer> -->
</div>
{:else}
<div class="flex flex-col h-screen text-center align-middle items-center justify-center">
	<a href={data.authLink} id="loginButton"><div class="card rounded p-4 w-full text-center min-w-[320px]">Log in with <img src="img/logo-consumer-v2.svg" alt="login button" /></div></a>
</div>
{/if}

<style>
#popup li a { display: block; }
#loginButton > div { font-weight: bold; background: #1ed760; }
</style>