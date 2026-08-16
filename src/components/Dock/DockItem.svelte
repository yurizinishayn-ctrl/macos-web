<script module>
	const baseWidth = 57.6;
	const distanceLimit = baseWidth * 6;
	const beyond_the_distance_limit = distanceLimit + 1;
	const distanceInput = [-distanceLimit, -distanceLimit / 1.25, -distanceLimit / 2, 0, distanceLimit / 2, distanceLimit / 1.25, distanceLimit];
	const widthOutput = [baseWidth, baseWidth * 1.1, baseWidth * 1.414, baseWidth * 2, baseWidth * 1.414, baseWidth * 1.1, baseWidth];
</script>
<script lang="ts">
	import { interpolate } from 'popmotion';
	import { onDestroy, untrack } from 'svelte';
	import { sineInOut } from 'svelte/easing';
	import { spring, tweened } from 'svelte/motion';
	import { elevation } from '🍎/actions';
	import { apps_config } from '🍎/configs/apps/apps-config.ts';
	import { apps, type AppID } from '🍎/state/apps.svelte.ts';
	import { preferences } from '🍎/state/preferences.svelte.ts';

	const { mouse_x, app_id, needs_update = false }: { mouse_x: number | null; app_id: AppID; needs_update?: boolean } = $props();
	let icon_el = $state<HTMLElement>();
	let distance = $state(beyond_the_distance_limit);
	const width_px = spring(baseWidth, { damping: 0.47, stiffness: 0.12 });
	const get_width_from_distance = interpolate(distanceInput, widthOutput);
	$effect(() => { distance; untrack(() => ($width_px = get_width_from_distance(distance))); });
	let raf: number;
	function animate() {
		if (icon_el && mouse_x !== null) {
			const rect = icon_el.getBoundingClientRect();
			distance = mouse_x - (rect.left + rect.width / 2);
			return;
		}
		distance = beyond_the_distance_limit;
	}
	$effect(() => {
		mouse_x;
		if (preferences.reduced_motion || apps.is_being_dragged) return;
		raf = requestAnimationFrame(animate);
	});
	const { title = app_id } = $derived(apps_config[app_id]);
	const openWindow = $derived(apps_config[app_id]?.should_open_window !== false);
	const externalAction = $derived(apps_config[app_id]?.external_action);
	const appOpenIconBounceTransform = tweened(0, { duration: 400, easing: sineInOut });
	async function bounceEffect() { await appOpenIconBounceTransform.set(-40); appOpenIconBounceTransform.set(0); }
	async function openApp(e: MouseEvent) {
		if (!openWindow) { if (externalAction) await externalAction(e); return; }
		const isAppAlreadyOpen = apps.open[app_id];
		apps.open[app_id] = true;
		apps.active = app_id;
		if (!isAppAlreadyOpen) bounceEffect();
	}
	onDestroy(() => cancelAnimationFrame(raf));
	const is_app_store = $derived(app_id === 'appstore');
	const show_pwa_badge = $derived(is_app_store && needs_update);
	$effect(() => { if (show_pwa_badge) bounceEffect(); });
</script>

<button onclick={openApp} aria-label="Launch {title} app" class="dock-open-app-button {app_id}">
	<p class="tooltip" class:tooltip-enabled={!apps.is_being_dragged} class:dark={preferences.theme.scheme === 'dark'} use:elevation={'dock-tooltip'}>{title}</p>
	<span bind:this={icon_el} class="icon-shell" style:width="{$width_px / 16}rem" style:height="{$width_px / 16}rem" style:transform="translate(0, {$appOpenIconBounceTransform}px)">
		{#if app_id === 'finder'}
			<svg viewBox="0 0 64 64" aria-hidden="true">
				<defs>
					<linearGradient id="finder-blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#7ee8ff"/><stop offset=".48" stop-color="#52b5ff"/><stop offset="1" stop-color="#2a65da"/></linearGradient>
				</defs>
				<rect x="2" y="2" width="60" height="60" rx="18" fill="url(#finder-blue)"/>
				<path d="M32 2v60" stroke="#fff" stroke-opacity=".32"/>
				<path d="M14 32c1.5-9.4 7-16.2 18-17 11 .8 16.5 7.6 18 17-1.8 10.9-8.2 17.8-18 18.7C22.2 49.8 15.8 42.9 14 32Z" fill="#fff" fill-opacity=".08"/>
				<circle cx="24.2" cy="29.2" r="2.4" fill="#0b376b"/><circle cx="39.8" cy="29.2" r="2.4" fill="#0b376b"/>
				<path d="M18.7 27.8c3.2-2.9 6.6-2.9 9.8-.1M35.5 27.7c3.2-2.8 6.6-2.8 9.8.1" fill="none" stroke="#0b376b" stroke-width="2.6" stroke-linecap="round"/>
				<path d="M32 31.2c-1.1 3.4-1.4 6.8-.7 9.2" fill="none" stroke="#0b376b" stroke-width="2.3" stroke-linecap="round"/>
				<path d="M19.5 42c3.6 3.7 8.1 5.3 12.5 5.3 4.4 0 8.9-1.6 12.5-5.3" fill="none" stroke="#0b376b" stroke-width="2.7" stroke-linecap="round"/>
				<path d="M8 15c6.8-5.9 14.7-8.8 24-8.8S49.2 9.1 56 15" fill="none" stroke="#fff" stroke-opacity=".18" stroke-width="1.8"/>
			</svg>
		{:else if app_id === 'safari'}
			<svg viewBox="0 0 64 64" aria-hidden="true">
				<defs><radialGradient id="safari-bg"><stop stop-color="#eaf8ff"/><stop offset=".62" stop-color="#72cfff"/><stop offset="1" stop-color="#3485ef"/></radialGradient></defs>
				<circle cx="32" cy="32" r="30" fill="url(#safari-bg)" stroke="#fff" stroke-opacity=".7" stroke-width="1.5"/>
				<circle cx="32" cy="32" r="22.8" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="1.2"/>
				<path d="M36.6 13.5 33.6 33.3 13.8 48.3 29.2 28.7Z" fill="#fff"/>
				<path d="m36.6 13.5-3 19.8-19.8 15 22.8-14.7Z" fill="#ff3b30"/>
				<path d="M32 8v4M56 32h-4M32 56v-4M8 32h4" stroke="#fff" stroke-opacity=".5" stroke-width="1.4" stroke-linecap="round"/>
			</svg>
		{:else if app_id === 'calculator'}
			<svg viewBox="0 0 64 64" aria-hidden="true">
				<rect x="5" y="3" width="54" height="58" rx="14" fill="#2c2d31"/>
				<rect x="11" y="9" width="42" height="14" rx="4.5" fill="#81858b"/>
				<text x="48" y="19.2" text-anchor="end" font-size="7.8" font-family="-apple-system,Arial" fill="#fff">0</text>
				{#each [[18,32,'#777a80'],[31,32,'#777a80'],[44,32,'#777a80'],[18,44,'#777a80'],[31,44,'#777a80'],[44,44,'#777a80'],[18,55,'#777a80'],[31,55,'#777a80'],[44,55,'#ff9f0a']] as item}
					<circle cx={item[0]} cy={item[1]} r="4.15" fill={item[2]}/>
				{/each}
			</svg>
		{:else if app_id === 'calendar'}
			<svg viewBox="0 0 64 64" aria-hidden="true">
				<rect x="4" y="4" width="56" height="56" rx="13" fill="#fff"/>
				<path d="M4 17.5h56V15c0-6.1-4.9-11-11-11H15C8.9 4 4 8.9 4 15Z" fill="#ff3b30"/>
				<text x="32" y="43" text-anchor="middle" font-size="10" font-weight="650" font-family="-apple-system,Arial" fill="#ff3b30">AUG</text>
				<text x="32" y="56" text-anchor="middle" font-size="24" font-weight="700" font-family="-apple-system,Arial" fill="#1c1c1e">16</text>
			</svg>
		{:else if app_id === 'notes'}
			<svg viewBox="0 0 64 64" aria-hidden="true">
				<defs><linearGradient id="note-yellow" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#ffe769"/><stop offset="1" stop-color="#f6c936"/></linearGradient></defs>
				<rect x="7" y="4" width="50" height="56" rx="11" fill="url(#note-yellow)"/>
				<path d="M7 17h50" stroke="#d5ab1d" stroke-opacity=".45"/>
				<rect x="13" y="11" width="38" height="5" rx="2.5" fill="#fff"/>
				<rect x="13" y="24" width="31" height="2.7" rx="1.35" fill="#735f25" fill-opacity=".62"/>
				<rect x="13" y="32" width="35" height="2.7" rx="1.35" fill="#735f25" fill-opacity=".62"/>
				<rect x="13" y="40" width="27" height="2.7" rx="1.35" fill="#735f25" fill-opacity=".62"/>
			</svg>
		{:else if app_id === 'terminal'}
			<svg viewBox="0 0 64 64" aria-hidden="true">
				<rect x="4" y="5" width="56" height="54" rx="13" fill="#151618"/>
				<path d="M12 21 23 32 12 43" fill="none" stroke="#f3f3f4" stroke-width="3.7" stroke-linecap="round" stroke-linejoin="round"/>
				<path d="M29 44h22" stroke="#f3f3f4" stroke-width="3.7" stroke-linecap="round"/>
				<path d="M8 13h48" stroke="#fff" stroke-opacity=".12"/>
			</svg>
		{:else if app_id === 'vscode'}
			<svg viewBox="0 0 64 64" aria-hidden="true">
				<path d="M11 17 30 32 11 47 6 42V22Z" fill="#2aa8ff"/>
				<path d="m30 10 22 11v22L30 54 18 45l24-19-24-16Z" fill="#1686dd"/>
				<path d="m18 27 12 10 22-17v22L30 54 18 45l24-19Z" fill="#0d5ca8"/>
			</svg>
		{:else if app_id === 'system-preferences'}
			<svg viewBox="0 0 64 64" aria-hidden="true">
				<defs><linearGradient id="settings-body" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#f4f6f8"/><stop offset="1" stop-color="#c4cbd3"/></linearGradient></defs>
				<circle cx="32" cy="32" r="29" fill="url(#settings-body)" stroke="#fff" stroke-opacity=".55" stroke-width="1.5"/>
				{#each [0,45,90,135] as a}
					<rect x="29.6" y="8" width="4.8" height="48" rx="2.4" fill="#7b858f" transform={`rotate(${a} 32 32)`}/>
				{/each}
				<circle cx="32" cy="32" r="10.5" fill="#f3f5f7" stroke="#78838e" stroke-width="3.5"/>
				<circle cx="32" cy="32" r="4.4" fill="#78838e"/>
			</svg>
		{:else if app_id === 'appstore'}
			<svg viewBox="0 0 64 64" aria-hidden="true">
				<defs><linearGradient id="store-blue" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#65ddff"/><stop offset="1" stop-color="#0a77f7"/></linearGradient></defs>
				<rect x="3" y="3" width="58" height="58" rx="16" fill="url(#store-blue)"/>
				<path d="M22 43h20M24.8 22.2c3.5-.2 6 2 7.2 6.3 1.2-4.3 3.7-6.5 7.2-6.3M28 40l8.2-15.4M38.2 40l-3-5.1M21 40l7.6-13.4" fill="none" stroke="#fff" stroke-width="3.8" stroke-linecap="round" stroke-linejoin="round"/>
			</svg>
		{:else}
			<svg viewBox="0 0 64 64" aria-hidden="true">
				<defs><linearGradient id="generic-system" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#e8eef6"/><stop offset="1" stop-color="#9aa7b6"/></linearGradient></defs>
				<rect x="3" y="3" width="58" height="58" rx="16" fill="url(#generic-system)"/>
				<circle cx="32" cy="32" r="17" fill="none" stroke="#fff" stroke-opacity=".88" stroke-width="4"/>
				<path d="M32 20v24M20 32h24" stroke="#6b7784" stroke-width="3" stroke-linecap="round"/>
			</svg>
		{/if}
	</span>
	<div class="dot" style:--opacity={+apps.open[app_id]}></div>
	{#if show_pwa_badge}<div class="pwa-badge">1</div>{/if}
</button>

<style>
	button { display:flex; flex-direction:column; justify-content:flex-end; position:relative; border-radius:.7rem; padding:0; background:transparent; border:0; box-shadow:none; }
	.icon-shell { display:flex; align-items:center; justify-content:center; background:transparent; box-shadow:none; filter:none; flex:none; border-radius:18px; overflow:hidden; }
	svg { display:block; width:100%; height:100%; flex:none; }
	button:hover .tooltip-enabled, button:focus-visible .tooltip-enabled { display:block; }
	.tooltip { white-space:nowrap; position:absolute; bottom:3.65rem; left:50%; transform:translateX(-50%); background:color-mix(in srgb, var(--system-color-light) 58%, transparent); backdrop-filter:blur(8px); padding:.5rem .75rem; border-radius:.375rem; box-shadow:0 1px 5px 2px rgba(0,0,0,.3); color:var(--system-color-light-contrast); font-family:var(--system-font-family); font-size:.85rem; letter-spacing:.2px; display:none; }
	.tooltip.dark { color:var(--system-color-dark); }
	.dot { height:4px; width:4px; margin:0; border-radius:50%; background:var(--system-color-dark); opacity:var(--opacity); }
	.pwa-badge { position:absolute; top:0; right:-2px; background:#f83a3a; border-radius:50%; width:1.25rem; height:1.25rem; text-align:center; color:#fff; font-size:.8rem; line-height:1.25rem; }
</style>
