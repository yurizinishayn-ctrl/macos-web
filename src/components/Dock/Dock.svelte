<svelte:options runes={true} />

<script lang="ts">
	import { apps_config } from '🍎/configs/apps/apps-config';
	import { apps } from '🍎/state/apps.svelte';
	import { system_needs_update } from '🍎/state/system.svelte';
	import DockItem from './DockItem.svelte';

	let mouseX = $state<number | null>(null);
</script>

<section class="dock-container" aria-label="Dock">
	<div
		class="dock-el"
		onmousemove={(event) => (mouseX = event.clientX)}
		onmouseleave={() => (mouseX = null)}
	>
		{#each Object.entries(apps_config).filter(([, config]) => config.showInDock && !config.disabled) as [appID, config]}
			<DockItem mouse_x={mouseX} app_id={appID} needs_update={system_needs_update.value} />
		{/each}
	</div>
</section>

<style>
	.dock-container {
		position: fixed;
		z-index: 10000;
		left: 0;
		bottom: .35rem;
		width: 100%;
		min-height: 4.7rem;
		display: flex;
		justify-content: center;
		pointer-events: none;
		padding: 0 .5rem;
	}

	.dock-el {
		min-height: 4.15rem;
		max-width: min(96vw, 820px);
		padding: .32rem .4rem .35rem;
		display: flex;
		align-items: flex-end;
		gap: .05rem;
		pointer-events: auto;
		border: 1px solid color-mix(in srgb, var(--system-color-light) 34%, transparent);
		border-radius: 1.2rem;
		background: color-mix(in srgb, var(--system-color-light) 22%, transparent);
		box-shadow: 0 10px 28px rgba(0,0,0,.18), inset 0 1px 0 rgba(255,255,255,.14);
		backdrop-filter: blur(18px) saturate(125%);
		-webkit-backdrop-filter: blur(18px) saturate(125%);
	}

	@media (max-width: 640px) {
		.dock-container { bottom: .2rem; }
		.dock-el { max-width: 99vw; overflow-x: auto; border-radius: 1rem; }
	}
</style>
