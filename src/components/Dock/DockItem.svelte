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
	let icon_el = $state<SVGSVGElement>();
	let distance = $state(beyond_the_distance_limit);
	const width_px = spring(baseWidth, { damping: 0.47, stiffness: 0.12 });
	const get_width_from_distance = interpolate(distanceInput, widthOutput);
	$effect(() => { distance; untrack(() => ($width_px = get_width_from_distance(distance))); });
	let raf: number;
	function animate() {
		if (icon_el && mouse_x !== null) { const rect = icon_el.getBoundingClientRect(); distance = mouse_x - (rect.left + rect.width / 2); return; }
		distance = beyond_the_distance_limit;
	}
	$effect(() => { mouse_x; if (preferences.reduced_motion || apps.is_being_dragged) return; raf = requestAnimationFrame(animate); });
	const { title = app_id } = $derived(apps_config[app_id]);
	const openWindow = $derived(apps_config[app_id]?.should_open_window !== false);
	const externalAction = $derived(apps_config[app_id]?.external_action);
	const appOpenIconBounceTransform = tweened(0, { duration: 400, easing: sineInOut });
	async function bounceEffect() { await appOpenIconBounceTransform.set(-40); appOpenIconBounceTransform.set(0); }
	async function openApp(e: MouseEvent) {
		if (!openWindow) { if (externalAction) await externalAction(e); return; }
		const isAppAlreadyOpen = apps.open[app_id];
		apps.open[app_id] = true; apps.active = app_id;
		if (!isAppAlreadyOpen) bounceEffect();
	}
	onDestroy(() => cancelAnimationFrame(raf));
	const is_app_store = $derived(app_id === 'appstore');
	const show_pwa_badge = $derived(is_app_store && needs_update);
	$effect(() => { if (show_pwa_badge) bounceEffect(); });
</script>

<button onclick={openApp} aria-label="Launch {title} app" class="dock-open-app-button {app_id}">
	<p class="tooltip" class:tooltip-enabled={!apps.is_being_dragged} class:dark={preferences.theme.scheme === 'dark'} style:top={preferences.reduced_motion ? '-50px' : '-35%'} style:transform="translate(0, {$appOpenIconBounceTransform}px)" use:elevation={'dock-tooltip'}>{title}</p>
	<span class="icon-shell" style:transform="translate(0, {$appOpenIconBounceTransform}px)">
		{#if app_id === 'finder'}
			<svg bind:this={icon_el} viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="finder" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#62d3ff"/><stop offset="1" stop-color="#1976ff"/></linearGradient></defs><rect x="2" y="2" width="60" height="60" rx="14" fill="url(#finder)"/><path d="M32 4v56" stroke="#fff" stroke-opacity=".45"/><path d="M17 25c4-4 8-4 12 0M35 25c4-4 8-4 12 0M21 42c7 5 15 5 22 0" fill="none" stroke="#13274b" stroke-width="3.2" stroke-linecap="round"/></svg>
		{:else if app_id === 'safari'}
			<svg bind:this={icon_el} viewBox="0 0 64 64" aria-hidden="true"><defs><linearGradient id="safari" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#7fe7ff"/><stop offset="1" stop-color="#208cff"/></linearGradient></defs><circle cx="32" cy="32" r="29" fill="url(#safari)" stroke="#fff" stroke-opacity=".55" stroke-width="2"/><circle cx="32" cy="32" r="24" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.4"/><path d="M39 16 35 35 18 43 29 29Z" fill="#fff"/><path d="m39 16-4 19-17 8 11-14Z" fill="#ff5b4d"/></svg>
		{:else if app_id === 'calculator'}
			<svg bind:this={icon_el} viewBox="0 0 64 64" aria-hidden="true"><rect x="5" y="3" width="54" height="58" rx="12" fill="#26272a"/><rect x="12" y="9" width="40" height="12" rx="4" fill="#6f7277"/><g fill="#f6f7f9"><circle cx="18" cy="31" r="4"/><circle cx="32" cy="31" r="4"/><circle cx="46" cy="31" r="4"/><circle cx="18" cy="44" r="4"/><circle cx="32" cy="44" r="4"/><circle cx="46" cy="44" r="4"/></g><circle cx="18" cy="55" r="4" fill="#ff9f0a"/><circle cx="32" cy="55" r="4" fill="#ff9f0a"/><circle cx="46" cy="55" r="4" fill="#ff9f0a"/></svg>
		{:else if app_id === 'calendar'}
			<svg bind:this={icon_el} viewBox="0 0 64 64" aria-hidden="true"><rect x="5" y="4" width="54" height="56" rx="12" fill="#f7f7f7"/><path d="M5 18h54V15c0-6-5-11-11-11H16C10 4 5 9 5 15Z" fill="#ff3b30"/><text x="32" y="46" text-anchor="middle" font-size="29" font-family="Arial, sans-serif" font-weight="700" fill="#222">16</text></svg>
		{:else if app_id === 'notes'}
			<svg bind:this={icon_el} viewBox="0 0 64 64" aria-hidden="true"><rect x="7" y="3" width="50" height="58" rx="9" fill="#ffd75a"/><rect x="14" y="12" width="36" height="5" rx="2.5" fill="#fff" fill-opacity=".9"/><rect x="14" y="23" width="30" height="4" rx="2" fill="#8b6d14" fill-opacity=".45"/><rect x="14" y="33" width="30" height="4" rx="2" fill="#8b6d14" fill-opacity=".45"/><rect x="14" y="43" width="24" height="4" rx="2" fill="#8b6d14" fill-opacity=".45"/></svg>
		{:else if app_id === 'terminal'}
			<svg bind:this={icon_el} viewBox="0 0 64 64" aria-hidden="true"><rect x="3" y="5" width="58" height="54" rx="12" fill="#15161a"/><path d="m13 20 11 10-11 10" fill="none" stroke="#66ff8a" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M29 43h18" stroke="#e7e7ea" stroke-width="4" stroke-linecap="round"/></svg>
		{:else if app_id === 'vscode'}
			<svg bind:this={icon_el} viewBox="0 0 64 64" aria-hidden="true"><path d="M11 18 31 32 11 46 5 40V24Z" fill="#22a7ff"/><path d="m31 11 20 10v22L31 53 18 44l25-19-25-17Z" fill="#1677d2"/><path d="m18 27 13 10 20-16v22L31 54 18 44l25-19Z" fill="#0c5ca8"/></svg>
		{:else}
			<svg bind:this={icon_el} viewBox="0 0 64 64" aria-hidden="true"><rect x="2" y="2" width="60" height="60" rx="15" fill="#0a8cff"/><path d="M32 12 22 32h8l-4 20 16-26h-8Z" fill="#fff" opacity=".92"/></svg>
		{/if}
	</span>
	<div class="dot" style:--opacity={+apps.open[app_id]}></div>
	{#if show_pwa_badge}<div class="pwa-badge" style:transform="scale({$width_px / baseWidth})">1</div>{/if}
</button>

<style>
	button { display:flex; flex-direction:column; justify-content:flex-end; position:relative; border-radius:.65rem; padding:0; background:transparent; border:0; box-shadow:none; }
	.icon-shell { display:flex; align-items:center; justify-content:center; background:transparent; box-shadow:none; filter:none; }
	svg { display:block; width:{$width_px / 16}rem; height:{$width_px / 16}rem; flex:none; }
	button:hover .tooltip-enabled, button:focus-visible .tooltip-enabled { display:block; }
	.tooltip { white-space:nowrap; position:absolute; background:color-mix(in srgb, var(--system-color-light) 58%, transparent); backdrop-filter:blur(8px); padding:.5rem .75rem; border-radius:.375rem; box-shadow:hsla(0,0%,0%,.3) 0 1px 5px 2px; color:var(--system-color-light-contrast); font-family:var(--system-font-family); font-size:.9rem; letter-spacing:.4px; display:none; }
	.tooltip.dark { color:var(--system-color-dark); }
	.dot { height:4px; width:4px; margin:0; border-radius:50%; background:var(--system-color-dark); opacity:var(--opacity); }
	.pwa-badge { position:absolute; top:1px; right:-1px; background:rgba(248,58,58,.85); border-radius:50%; pointer-events:none; width:1.5rem; height:1.5rem; text-align:center; color:#fff; font-size:1rem; line-height:1.5; }
</style>
