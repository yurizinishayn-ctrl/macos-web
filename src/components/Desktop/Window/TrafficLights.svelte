<script lang="ts">
	import CloseIcon from '🍎/components/SVG/traffic-lights/CloseSVG.svelte';
	import GreenLight from '🍎/components/SVG/traffic-lights/GreenLight.svelte';
	import MinimizeSvg from '🍎/components/SVG/traffic-lights/MinimizeSVG.svelte';
	import { apps_config } from '🍎/configs/apps/apps-config.ts';
	import { apps, type AppID } from '🍎/state/apps.svelte.ts';

	const { app_id, on_close_app, on_maximize_click }: { app_id: AppID; on_close_app: () => void; on_maximize_click: () => void } = $props();
</script>

<div class="container" class:unfocused={apps.active !== app_id} aria-label="Window controls">
	<button class="traffic close-light" type="button" aria-label="Close window" title="Close" onclick={on_close_app}><CloseIcon /></button>
	<button class="traffic minimize-light" type="button" aria-label="Minimize window" title="Minimize"><MinimizeSvg /></button>
	<button class="traffic stretch-light" type="button" aria-label="Zoom window" title="Zoom" onclick={on_maximize_click}><GreenLight expandable={apps_config[app_id].expandable} /></button>
</div>

<style>
	.container {
		display: flex;
		align-items: center;
		gap: 0.48rem;
		height: 1.15rem;
	}
	.traffic {
		--size: 0.82rem;
		--bgcolor: #b8b8b8;
		--border-color: rgba(0,0,0,.14);
		position: relative;
		display: grid;
		place-items: center;
		width: var(--size);
		height: var(--size);
		padding: 0;
		border: 0;
		border-radius: 50%;
		background: var(--bgcolor);
		box-shadow: inset 0 0 0 0.5px var(--border-color), 0 0.5px 1px rgba(0,0,0,.18);
		cursor: pointer;
		transition: transform 120ms ease, filter 120ms ease;
	}
	.traffic :global(svg) {
		width: 0.46rem;
		height: 0.46rem;
		opacity: 0.72;
		transition: opacity 120ms ease;
	}
	.container:hover .traffic,
	.traffic:focus-visible { transform: scale(1.06); }
	.container:hover .traffic :global(svg),
	.traffic:focus-visible :global(svg) { opacity: 1; }
	.container.unfocused .traffic { --bgcolor:#aeadb0; --border-color:rgba(0,0,0,.18); filter:saturate(.25); }
	.close-light { --bgcolor:#ff5f57; --border-color:#e0443e; }
	.minimize-light { --bgcolor:#febc2e; --border-color:#dea123; }
	.stretch-light { --bgcolor:#28c840; --border-color:#1aab29; }
	.stretch-light :global(svg) { transform:rotate(90deg); }
</style>
