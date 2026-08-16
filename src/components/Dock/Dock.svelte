<svelte:options runes={true} />

<script lang="ts">
	import { elevation } from '🍎/actions';
	import { apps_config } from '🍎/configs/apps/apps-config';
	import { apps } from '🍎/state/apps.svelte';
	import { system_needs_update } from '🍎/state/system.svelte';
	import DockItem from './DockItem.svelte';

	let dock_mouse_x = $state<number | null>(null);
</script>

<section class="dock-container" use:elevation={'dock'} aria-label="Dock">
	<div
		class="dock-el"
		onmousemove={(event) => (dock_mouse_x = event.clientX)}
		onmouseleave={() => (dock_mouse_x = null)}
	>
		{#each Object.entries(apps_config).filter(([, config]) => config.showInDock && !config.disabled) as [appID, config]}
			{#if config.dock_breaks_before}
				<div class="divider" aria-hidden="true"></div>
			{/if}

			<DockItem mouse_x={dock_mouse_x} app_id={appID} needs_update={system_needs_update.value} />
		{/each}
	</div>
</section>

<style>
	.dock-container {
		position: fixed;
		z-index: 10000;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 6rem;
		padding: 0.5rem 0.75rem 0.75rem;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		pointer-events: none;
	}

	.dock-el {
		min-height: 4.75rem;
		max-width: min(96vw, 860px);
		padding: 0.45rem 0.55rem;
		display: flex;
		align-items: flex-end;
		justify-content: center;
		gap: 0.15rem;
		border: 1px solid rgba(255, 255, 255, 0.18);
		border-radius: 1.35rem;
		background: rgba(35, 35, 38, 0.5);
		box-shadow: 0 14px 40px rgba(0, 0, 0, 0.32), inset 0 1px rgba(255, 255, 255, 0.18);
		backdrop-filter: blur(24px) saturate(160%);
		-webkit-backdrop-filter: blur(24px) saturate(160%);
		pointer-events: auto;
	}

	.divider {
		width: 1px;
		align-self: stretch;
		margin: 0.25rem 0.2rem;
		background: rgba(255, 255, 255, 0.18);
	}

	@media (max-width: 600px) {
		.dock-container {
			height: 5.2rem;
			padding-bottom: 0.4rem;
		}

		.dock-el {
			max-width: 98vw;
			overflow-x: auto;
			justify-content: flex-start;
			border-radius: 1.1rem;
		}
	}
</style>
