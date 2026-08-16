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
	async function bounceEffect() {
		await appOpenIconBounceTransform.set(-40);
		appOpenIconBounceTransform.set(0);
	}
	async function openApp(e: MouseEvent) {
		if (!openWindow) {
			if (externalAction) await externalAction(e);
			return;
		}
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
				<defs><linearGradient id="sq-finder" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#76dcff"/><stop offset=".5" stop-color="#58a9ff"/><stop offset="1" stop-color="#2c63ff"/></linearGradient></defs>
			<rect x="2" y="2" width="60" height="60" rx="16" fill="url(#sq-finder)"/>
			<path d="M32 3v58" stroke="#fff" stroke-opacity=".35"/>
			<path d="M18 28c3-3 7-3 11 0M35 28c4-3 8-3 11 0" fill="none" stroke="#12346f" stroke-width="3" stroke-linecap="round"/>
			<circle cx="24" cy="29" r="2.5" fill="#12346f"/><circle cx="40" cy="29" r="2.5" fill="#12346f"/>
			<path d="M19 41c7 6 19 6 26 0" fill="none" stroke="#12346f" stroke-width="3" stroke-linecap="round"/>
			<path d="M32 43c-3-4-4-8-4-12" fill="none" stroke="#12346f" stroke-width="2.2" stroke-linecap="round" opacity=".55"/>
			<path d="M4 18h56" stroke="#fff" stroke-opacity=".14"/>
			</svg>
		{:else if app_id === 'safari'}
			<svg viewBox="0 0 64 64" aria-hidden="true">
				<defs><linearGradient id="sq-safari" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#a3ecff"/><stop offset="1" stop-color="#4a91ff"/></linearGradient></defs>
			<circle cx="32" cy="32" r="30" fill="url(#sq-safari)" stroke="#fff" stroke-opacity=".7" stroke-width="2"/>
			<circle cx="32" cy="32" r="23.5" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="1.5"/>
			<path d="M36.8 13.8 33.8 33.8 14.7 45.4l12.4-18.8Z" fill="#fff" opacity=".94"/>
			<path d="m36.8 13.8-3 20-19.1 11.6 13.2-18.8Z" fill="#ff5b4d"/>
			<path d="M32 10v4M54 32h-4M32 54v-4M10 32h4" stroke="#fff" stroke-opacity=".45" stroke-width="1.5" stroke-linecap="round"/>
			</svg>
		{:else if app_id === 'calculator'}
			<svg viewBox="0 0 64 64" aria-hidden="true">
				<defs><linearGradient id="sq-calc" x1="0" y1="0" x2="0" y2="1"><stop stop-color="#3f4146"/><stop offset="1" stop-color="#1a1b1e"/></linearGradient></defs>
			<rect x="5" y="3" width="54" height="58" rx="14" fill="url(#sq-calc)"/>
			<rect x="11" y="10" width="42" height="13" rx="4" fill="#777b81"/>
			<text x="49" y="20" text-anchor="end" font-size="8" font-family="SF Pro Display,Arial" fill="#fff" opacity=".9">0</text>
			<g fill="#f4f4f5"><circle cx="18" cy="32" r="4"/><circle cx="31" cy="32" r="4"/><circle cx="44" cy="32" r="4"/><circle cx="18" cy="45" r="4"/><circle cx="31" cy="45" r="4"/><circle cx="44" cy="45" r="4"/></g>
			<g fill="#ff9f0a"><circle cx="18" cy="55" r="4"/><circle cx="31" cy="55" r="4"/><circle cx="44" cy="55" r="4"/></g>
			</svg>
		{:else if app_id === 'calendar'}
			<svg viewBox="0 0 64 64" aria-hidden="true">
				<rect x="4" y="4" width="56" height="56" rx="14" fill="#fff"/>
				<path d="M4 18h56V15c0-6.1-4.9-11-11-11H15C8.9 4 4 8.9 4 15Z" fill="#ff3b30"/>
				<text x="32" y="42" text-anchor="middle" font-size="12" font-family="SF Pro Display,Arial" font-weight="600" fill="#ff3b30">AUGUST</text>
				<text x="32" y="56" text-anchor="middle" font-size="24" font-family="SF Pro Display,Arial" font-weight="700" fill="#1c1c1e">16</text>
			</svg>
		{:else if app_id === 'notes'}
			<svg viewBox="0 0 64 64" aria-hidden="true">
				<rect x="6" y="3" width="52" height="58" rx="10" fill="#ffd94f"/>
				<rect x="12" y="12" width="40" height="6" rx="3" fill="#fff" opacity=".98"/>
				<rect x="12" y="23" width="31" height="3".5 rx="1.75" fill="#7d6b2c" opacity=".62"/>
				<rect x="12" y="32" width="36" height="3.5" rx="1.75" fill="#7d6b2c" opacity=".62"/>
				<rect x="12" y="41" width="28" height="3.5" rx="1.75" fill="#7d6b2c" opacity=".62"/>
				<path d="M6 17h52" stroke="#d6aa19" stroke-opacity=".4"/>
			</svg>
		{:else if app_id === 'terminal'}
			<svg viewBox="0 0 64 64" aria-hidden="true">
				<defs><linearGradient id="sq-terminal" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#2a2d31"/><stop offset="1" stop-color="#0c0d0f"/></linearGradient></defs>
			<rect x="3" y="5" width="58" height="54" rx="13" fill="url(#sq-terminal)"/>
			<path d="M12 21 24 32 12 43" fill="none" stroke="#7cff9c" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/>
			<path d="M30 44h21" stroke="#f2f2f3" stroke-width="4" stroke-linecap="round"/>
			<path d="M8 12h48" stroke="#fff" stroke-opacity=".12"/>
			</svg>
		{:else if app_id === 'vscode'}
			<svg viewBox="0 0 64 64" aria-hidden="true">
				<path d="M10 16 31 32 10 48 5 43V21Z" fill="#2aa9ff"/>
				<path d="m31 10 21 11v22L31 54 18 44l25-19-25-17Z" fill="#1685da"/>
				<path d="m18 27 13 10 21-16v22L31 54 18 44l25-19Z" fill="#0d5ca7"/>
			</svg>
		{:else if app_id === 'system-preferences'}
			<svg viewBox="0 0 64 64" aria-hidden="true">
				<defs><linearGradient id="sq-settings" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#eef2f6"/><stop offset="1" stop-color="#c8cfd8"/></linearGradient></defs>
			<rect x="4" y="4" width="56" height="56" rx="15" fill="url(#sq-settings)"/>
			<circle cx="32" cy="32" r="12" fill="#f7f8fa" stroke="#858c95" stroke-width="4"/>
			<path d="M32 12v8M32 44v8M12 32h8M44 32h8M18 18l6 6M40 40l6 6M46 18l-6 6M24 40l-6 6" stroke="#858c95" stroke-width="4" stroke-linecap="round"/>
			</svg>
		{:else if app_id === 'appstore'}
			<svg viewBox="0 0 64 64" aria-hidden="true">
				<defs><linearGradient id="sq-store" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#4fd7ff"/><stop offset="1" stop-color="#0b80ff"/></linearGradient></defs>
			<rect x="3" y="3" width="58" height="58" rx="16" fill="url(#sq-store)"/>
			<path d="M22 42h21M24 22c4 0 7 3 8 7 1-4 4-7 8-7" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
			<path d="m28 39 8-14M38 39l-3-5M21 39l7-12" stroke="#fff" stroke-width="4" stroke-linecap="round"/>
			</svg>
		{:else}
			<svg viewBox="0 0 64 64" aria-hidden="true">
				<defs><linearGradient id="sq-generic" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#57c8ff"/><stop offset="1" stop-color="#1264ff"/></linearGradient></defs>
			<rect x="2" y="2" width="60" height="60" rx="16" fill="url(#sq-generic)"/>
			<path d="M32 11 22 33h9l-4 20 15-25h-9Z" fill="#fff" opacity=".95"/>
			</svg>
		{/if}
	</span>
	<div class="dot" style:--opacity={+apps.open[app_id]}></div>
	{#if show_pwa_badge}<div class="pwa-badge">1</div>{/if}
</button>

<style>
	button { display:flex; flex-direction:column; justify-content:flex-end; position:relative; border-radius:.7rem; padding:0; background:transparent; border:0; box-shadow:none; }
	.icon-shell { display:flex; align-items:center; justify-content:center; background:transparent; box-shadow:0 1px 1px rgba(0,0,0,.12),0 5px 12px rgba(0,0,0,.14); filter:none; flex:none; border-radius:16px; overflow:hidden; }
	svg { display:block; width:100%; height:100%; flex:none; }
	button:hover .tooltip-enabled, button:focus-visible .tooltip-enabled { display:block; }
	.tooltip { white-space:nowrap; position:absolute; bottom:3.65rem; left:50%; transform:translateX(-50%); background:color-mix(in srgb, var(--system-color-light) 58%, transparent); backdrop-filter:blur(10px) saturate(130%); padding:.5rem .75rem; border-radius:.5rem; box-shadow:0 8px 22px rgba(0,0,0,.2), inset 0 1px 0 rgba(255,255,255,.28); color:var(--system-color-light-contrast); font-family:var(--system-font-family); font-size:.85rem; letter-spacing:.2px; display:none; }
	.tooltip.dark { color:var(--system-color-dark); }
	.dot { height:4px; width:4px; margin:2px auto 0; border-radius:50%; background:var(--system-color-dark); opacity:var(--opacity); }
	.pwa-badge { position:absolute; top:-2px; right:-2px; background:#f83a3a; border-radius:999px; width:1.25rem; height:1.25rem; text-align:center; color:#fff; font-size:.8rem; line-height:1.25rem; box-shadow:0 1px 4px rgba(0,0,0,.25); }
</style>
