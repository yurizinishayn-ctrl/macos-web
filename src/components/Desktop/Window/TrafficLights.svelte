<script lang="ts">
	import { apps_config } from '🍎/configs/apps/apps-config.ts';
	import { apps, type AppID } from '🍎/state/apps.svelte.ts';

	const { app_id, on_close_app, on_maximize_click }: { app_id: AppID; on_close_app: () => void; on_maximize_click: () => void } = $props();
</script>

<div class="container" class:unfocused={apps.active !== app_id} aria-label="Window controls">
	<button class="traffic close-light" type="button" aria-label="Close window" title="Close" onclick={on_close_app}><span class="x"></span></button>
	<button class="traffic minimize-light" type="button" aria-label="Minimize window" title="Minimize"><span class="minus"></span></button>
	<button class="traffic stretch-light" type="button" aria-label="Zoom window" title="Zoom" onclick={on_maximize_click}><span class="zoom"></span></button>
</div>

<style>
	.container { display:flex; align-items:center; gap:.45rem; height:1rem; }
	.traffic { --size:.8rem; width:var(--size); height:var(--size); padding:0; border:0; border-radius:50%; display:grid; place-items:center; position:relative; background:var(--bg); box-shadow:inset 0 0 0 .5px var(--border), 0 1px 2px rgba(0,0,0,.16); cursor:pointer; }
	.traffic:hover, .traffic:focus-visible { filter:brightness(1.04); outline:none; }
	.container.unfocused .traffic { filter:saturate(.12) brightness(.95); }
	.close-light { --bg:#ff5f57; --border:#e0443e; }
	.minimize-light { --bg:#febc2e; --border:#dea123; }
	.stretch-light { --bg:#28c840; --border:#1aab29; }
	.x, .minus, .zoom { display:block; position:relative; width:.36rem; height:.36rem; }
	.x::before, .x::after { content:''; position:absolute; left:50%; top:50%; width:.32rem; height:1.5px; border-radius:2px; background:rgba(40,40,40,.72); }
	.x::before { transform:translate(-50%,-50%) rotate(45deg); }
	.x::after { transform:translate(-50%,-50%) rotate(-45deg); }
	.minus::before { content:''; position:absolute; left:50%; top:50%; width:.34rem; height:1.5px; border-radius:2px; background:rgba(60,45,5,.7); transform:translate(-50%,-50%); }
	.zoom { border:1.5px solid rgba(15,80,20,.72); border-radius:2px; box-sizing:border-box; }
</style>
