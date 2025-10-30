<script lang="ts">
	import './layout.css';
	import favicon from '$lib/assets/paimon.png';
	import { Avatar, Popover, Portal, Switch, AppBar, Navigation } from '@skeletonlabs/skeleton-svelte';
	import { ListIcon, TableIcon } from '@lucide/svelte';
	import { currentTheme } from '$lib/stores.js';
    import { onMount } from 'svelte';
	
	// load Svelte 5 store helper stuff
	let { children, data } = $props();

	// load list of themes from Skeleton including the icons they used in 2024 (dunno about now)
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

	// theme / dark mode handling
	let theme = $state(currentTheme);

	$effect(() => {
		document.documentElement.setAttribute('data-theme', theme);
	})

	let darkMode = $state(false);

	$effect(() => {
		if (darkMode) {
			document.documentElement.classList.add('dark')
		} else {
			document.documentElement.classList.remove('dark')
		}
	})

	onMount(() => {
		darkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
	});

	// styles
	const anchorRail = 'btn hover:preset-tonal w-full max-w-[84px] flex flex-col items-center gap-0.5';
	const anchorBar = 'btn hover:preset-tonal flex-col items-center gap-1';
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<title>Genshin Playlist Table</title>
</svelte:head>


<div class="grid h-screen grid-rows-[auto_1fr_auto]">
	<AppBar>
		<AppBar.Toolbar class="grid-cols-[auto_1fr_auto]">
			<AppBar.Lead>
				<!-- <button type="button" class="btn-icon btn-icon-lg hover:preset-tonal" aria-label="Home"><img src="img/paimon.png" alt="The icon (whether you like it or not)" /></button> -->
			</AppBar.Lead>
			<AppBar.Headline>
				<h1 class="h3"><a href="/">Genshin Spotify Table</a></h1>
			</AppBar.Headline>
			<AppBar.Trail>
				<Popover>
					<Popover.Trigger>
						<Avatar class="size-10">
							<Avatar.Image src={favicon} alt="User Avatar" />
							<Avatar.Fallback>{data.username}</Avatar.Fallback>
						</Avatar>
					</Popover.Trigger>
					<Portal>
						<Popover.Positioner>
							<Popover.Content class="card p-4 bg-surface-100-900 shadow-xl">
								<ul id="popup" class="grid gap-4">
									<!-- <li><h1>{data.username}</h1></li> -->
									<div>
										Theme
										<select class="select" bind:value={theme}>
											{#each themes as { icon, name, type }}
												<option value={type}>{icon} {name}</option>
											{/each}
										</select>
									</div>
									<div class="flex justify-between items-center gap-4">
										<!-- <Switch name="darkMode" bind:checked={darkMode}></Switch> -->
										<Switch checked={darkMode} onchange={() => {
											darkMode = !darkMode;}}>
											<Switch.Label>Dark Mode</Switch.Label>
											<Switch.Control>
												<Switch.Thumb />
											</Switch.Control>
											<Switch.HiddenInput />
										</Switch>
									</div>
									<hr class="opacity-30">
								</ul>
							</Popover.Content>
						</Popover.Positioner>
					</Portal>
				</Popover>
			</AppBar.Trail>
		</AppBar.Toolbar>
	</AppBar>   


	<!-- Grid Columns -->
	<div class="grid grid-cols-1 md:grid-cols-[auto_1fr]">
		<!-- Left Sidebar. -->
		<aside class="sticky top-0 col-span-1 h-screen hidden md:block ">
			<Navigation layout="sidebar" class="w-auto">
				<Navigation.Content>
					<Navigation.Group>
						<Navigation.Menu>
							<a class={anchorRail} href="/playlists">
								<ListIcon class="size-5" />
								<span class="text-xs">Playlists</span>
							</a>
						</Navigation.Menu>
						<Navigation.Menu>
							<a class={anchorRail} href="/table">
								<TableIcon class="size-5" />
								<span class="text-xs">Compare</span>
							</a>
						</Navigation.Menu>
					</Navigation.Group>
				</Navigation.Content>
			</Navigation>	
		</aside>

		<!-- Main Content -->
		<main class="space-y-4 p-4 pb-0">
			{@render children()}
		</main>

		<Navigation layout="bar" class="hidden max-md:block sticky bottom-0 z-10 backdrop-blur-sm p-4">
			<Navigation.Content>
				<Navigation.Group>
					<Navigation.Menu class="grid grid-cols-2 gap-2">
						<a class={anchorBar} href="/playlists">
							<ListIcon class="size-5" />
							<span class="text-xs">Playlists</span>
						</a>
						<a class={anchorBar} href="/table">
							<TableIcon class="size-5" />
							<span class="text-xs">Compare</span>
						</a>
					</Navigation.Menu>
				</Navigation.Group>
			</Navigation.Content>
		</Navigation>
	</div>

	<!-- Footer -->
	<footer class="p-4 text-xs"><div class="text-right">Genshinly made with <a href="https://svelte.dev/">Svelte 5</a> + <a href="https://www.skeleton.dev/">Skeleton</a></div></footer>		
</div>

