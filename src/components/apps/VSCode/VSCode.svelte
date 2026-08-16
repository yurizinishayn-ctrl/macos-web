<script lang="ts">
	const { is_being_dragged }: { is_being_dragged: boolean } = $props();
</script>

<section class="container" class:dragging={is_being_dragged}>
	<header class="app-window-drag-handle">
		<div class="traffic-space" aria-hidden="true"></div>
		<div class="title">VS Code</div>
	</header>

	<div class="editor-shell">
		<iframe
			src="https://stackblitz.com/github/yurizinishayn-ctrl/macos-web?embed=1&file=src/components/Desktop/Desktop.svelte&hideNavigation=1&theme=dark&view=editor"
			title="VS Code for macOS Web"
			loading="lazy"
		></iframe>
	</div>
</section>

<style>
	.container {
		width: 100%;
		height: 100%;
		overflow: hidden;
		border-radius: inherit;
		background: #1e1e1e;
		color: #f5f5f5;
		display: grid;
		grid-template-rows: 2.8rem minmax(0, 1fr);
	}

	header {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		border-bottom: 1px solid rgba(255, 255, 255, 0.08);
		background: rgba(30, 30, 30, 0.94);
		backdrop-filter: blur(18px);
		user-select: none;
	}

	.title {
		font-size: 0.78rem;
		font-weight: 600;
		color: rgba(255, 255, 255, 0.78);
	}

	.traffic-space {
		position: absolute;
		inset: 0;
		pointer-events: none;
	}

	.editor-shell {
		min-width: 0;
		min-height: 0;
		overflow: hidden;
	}

	iframe {
		display: block;
		width: 100%;
		height: 100%;
		border: 0;
		background: #1e1e1e;
	}

	.container.dragging iframe {
		pointer-events: none;
	}

	:global(.tl-container.vscode) {
		top: 0.72rem;
		left: 0.72rem;
		z-index: 2;
	}
</style>
