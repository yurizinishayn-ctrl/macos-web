<svelte:options runes={true} />

<script lang="ts">
	import { elevation } from '🍎/actions';
	import { apps_config } from '🍎/configs/apps/apps-config';
	import { apps } from '🍎/state/apps.svelte';
	import { system_needs_update } from '🍎/state/system.svelte';
	import { is_dock_hidden } from '🍎/state/dock.svelte';
	import DockItem from './DockItem.svelte';
	import { untrack } from 'svelte';

	let dock_mouse_x = $state<number | null>(null);
	const HIDDEN_DOCK_THRESHOLD = 30;
	let bodyHeight = $state(0);
	let mouseY = $state(0);
	let dockContainerEl = $state<HTMLElement>();

	$effect(() => {
		if (Math.abs(mouseY - bodyHeight) > (dockContainerEl?.clientHeight ?? 0)) {
			untrack(() => (dock_mouse_x = null));
		}

		if (dock_mouse_x !== null) {
			untrack(() => (is_dock_hidden.value = false));
			return;
		}

		if (!Object.values(apps.fullscreen).some(Boolean)) {
			untrack(() => (is_dock_hidden.value = false));
			return;
		}

		untrack(() => (is_dock_hidden.value = Math.abs(mouseY - bodyHeight) > HIDDEN_DOCK_THRESHOLD));
	});
</script>

<svelte:body onmousemove={({ y }) => (mouseY = y)} />
<svelte:window bind:innerHeight={bodyHeight} />

<section
	class="dock-container"
	class:dock-hidden={is_dock_hidden.value}
	bind:this={dockContainerEl}
	use:elevation={'dock'}
	aria-label="Dock"
>
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="dock-el"
		class:hidden={is_dock_hidden.value}
		onmousemove={(event) => (dock_mouse_x = event.x)}
		onmouseleave={() => (dock_mouse_x = null)}
	>
		{#each Object.entries(apps_config).filter(([, config]) => config.showInDock) as [appID, config]}
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
		height: 5.4rem;
		padding: 0.45rem 0.65rem 0.7rem;
		display: flex;
		justify-content: center;
		pointer-events: none;
		transition: opacity 180ms ease, transform 280ms cubic-bezier(.2,.8,.2,1);
	}

	.dock-container.dock-hidden {
		transform: translateY(72%);
		opacity: 0.15;
	}

	.dock-el {
		position: relative;
		min-height: 100%;
		max-width: min(94vw, 760px);
		padding: 0.35rem;
		border: 1px solid var(--system-surface-border);
		border-radius: 1.35rem;
		background: var(--system-surface-background);
		box-shadow: var(--system-shadow);
		backdrop-filter: blur(28px) saturate(150%);
		-webkit-backdrop-filter: blur(28px) saturate(150%);
		display: flex;
		align-items: flex-end;
		gap: 0.15rem;
		transition: transform 280ms cubic-bezier(.2,.8,.2,1), background 180ms ease;
		pointer-events: auto;
	}

	.dock-el:hover {
		background: color-mix(in srgb, var(--system-surface-background) 88%, transparent);
	}

	.dock-el.hidden {
		transform: translateY(180%);
		pointer-events: none;
	}

	.divider {
		align-self: stretch;
		width: 1px;
		margin: 0.35rem 0.2rem;
		background: var(--system-divider);
	}

	@media (max-width: 600px) {
		.dock-container {
			height: 4.8rem;
			padding-bottom: 0.45rem;
		}

		.dock-el {
			max-width: 96vw;
			border-radius: 1.1rem;
			overflow-x: auto;
		}
	}
</style>
