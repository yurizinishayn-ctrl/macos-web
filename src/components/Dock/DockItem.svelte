<script module>
	const baseWidth = 57.6;
	const distanceLimit = baseWidth * 6;
	const beyond_the_distance_limit = distanceLimit + 1;
	const distanceInput = [
		-distanceLimit,
		-distanceLimit / 1.25,
		-distanceLimit / 2,
		0,
		distanceLimit / 2,
		distanceLimit / 1.25,
		distanceLimit,
	];
	const widthOutput = [
		baseWidth,
		baseWidth * 1.1,
		baseWidth * 1.414,
		baseWidth * 2,
		baseWidth * 1.414,
		baseWidth * 1.1,
		baseWidth,
	];
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

	const {
		mouse_x,
		app_id,
		needs_update = false,
	}: {
		mouse_x: number | null;
		app_id: AppID;
		needs_update?: boolean;
	} = $props();

	let image_el = $state<HTMLImageElement>();
	let distance = $state(beyond_the_distance_limit);
	const width_px = spring(baseWidth, { damping: 0.47, stiffness: 0.12 });
	const get_width_from_distance = interpolate(distanceInput, widthOutput);

	$effect(() => {
		distance;
		untrack(() => ($width_px = get_width_from_distance(distance)));
	});

	let raf: number;
	function animate() {
		if (image_el && mouse_x !== null) {
			const rect = image_el.getBoundingClientRect();
			const img_center_x = rect.left + rect.width / 2;
			distance = mouse_x - img_center_x;
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
	const iconSrc = $derived(`${import.meta.env.BASE_URL}app-icons/${app_id}/256.webp`);
	const pngIconSrc = $derived(`${import.meta.env.BASE_URL}app-icons/${app_id}/256.png`);

	$effect(() => {
		if (show_pwa_badge) bounceEffect();
	});
</script>

<button onclick={openApp} aria-label="Launch {title} app" class="dock-open-app-button {app_id}">
	<p
		class="tooltip"
		class:tooltip-enabled={!apps.is_being_dragged}
		class:dark={preferences.theme.scheme === 'dark'}
		style:top={preferences.reduced_motion ? '-50px' : '-35%'}
		style:transform="translate(0, {$appOpenIconBounceTransform}px)"
		use:elevation={'dock-tooltip'}
	>
		{title}
	</p>

	<span style:transform="translate(0, {$appOpenIconBounceTransform}px)">
		<picture>
			<source srcset={iconSrc} type="image/webp" />
			<img
				bind:this={image_el}
				src={pngIconSrc}
				alt="{title} app"
				style:width="{$width_px / 16}rem"
				draggable="false"
				onerror={(event) => {
					const img = event.currentTarget as HTMLImageElement;
					if (img.src !== pngIconSrc) img.src = pngIconSrc;
				}}
			/>
		</picture>
	</span>

	<div class="dot" style:--opacity={+apps.open[app_id]}></div>

	{#if show_pwa_badge}
		<div class="pwa-badge" style:transform="scale({$width_px / baseWidth})">1</div>
	{/if}
</button>

<style>
	img { display: block; will-change: width; }
	button {
		display: flex;
		flex-direction: column;
		justify-content: flex-end;
		position: relative;
		border-radius: 0.5rem;
	}
	button:hover .tooltip-enabled,
	button:focus-visible .tooltip-enabled { display: block; }
	button > span { display: flex; justify-content: center; align-items: center; }
	picture { display: block; }
	.tooltip {
		white-space: nowrap;
		position: absolute;
		background: color-mix(in srgb, var(--system-color-light) 58%, transparent);
		backdrop-filter: blur(8px);
		padding: 0.5rem 0.75rem;
		border-radius: 0.375rem;
		box-shadow: hsla(0deg, 0%, 0%, 30%) 0 1px 5px 2px;
		color: var(--system-color-light-contrast);
		font-family: var(--system-font-family);
		font-size: 0.9rem;
		letter-spacing: 0.4px;
		display: none;
	}
	.tooltip.dark { background: color-mix(in srgb, var(--system-color-light) 58%, transparent); color: var(--system-color-dark); }
	.dot { height: 4px; width: 4px; margin: 0; border-radius: 50%; background: var(--system-color-dark); opacity: var(--opacity); }
	.pwa-badge {
		position: absolute; top: 1px; right: -1px; background: rgba(248,58,58,.85);
		box-shadow: hsla(var(--system-color-dark-hsl), .4) 0 .5px 2px;
		border-radius: 50%; pointer-events: none; width: 1.5rem; height: 1.5rem;
		text-align: center; color: white; font-size: 1rem; line-height: 1.5;
	}
</style>
