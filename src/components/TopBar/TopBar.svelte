<script lang="ts">
	import { fade_out } from '🍎/helpers/fade';
	import { should_show_notch } from '🍎/state/menubar.svelte.ts';
	import { sineIn } from 'svelte/easing';
	import { fade } from 'svelte/transition';
	import ActionCenterToggle from './ActionCenterToggle.svelte';
	import MenuBar from './MenuBar.svelte';
	import TopBarTime from './TopBarTime.svelte';
</script>

<header>
	<MenuBar />
	<span class="spacer"></span>

	{#if should_show_notch.value}
		<div class="notch" in:fade={{ duration: 150, easing: sineIn }} out:fade_out>
			<span>
				<img src={`${import.meta.env.BASE_URL}emojis/wink.png`} alt="Wink" class="emoji" />
			</span>
		</div>
	{/if}

	<ActionCenterToggle />
	<button class="clock"><TopBarTime /></button>
</header>

<style>
	header {
		position: relative;
		z-index: 10001;
		display: flex;
		align-items: center;
		width: 100%;
		height: 1.8rem;
		padding: 0 .25rem;
		background: color-mix(in srgb, var(--system-color-light) 24%, transparent);
		border-bottom: 1px solid color-mix(in srgb, var(--system-color-light) 18%, transparent);
		backdrop-filter: blur(16px) saturate(120%);
		-webkit-backdrop-filter: blur(16px) saturate(120%);
		color: var(--system-color-light-contrast);
		fill: var(--system-color-light-contrast);
	}

	.spacer { flex: 1 1 auto; }
	.clock { height: 100%; padding: 0 .45rem; font-weight: 500; font-size: .8rem; letter-spacing: .3px; }
	.emoji { height: 1.5em; width: 1.5em; }

	.notch {
		--width: 140px;
		position: absolute;
		top: 0;
		left: 50%;
		width: var(--width);
		height: 95%;
		display: grid;
		place-items: center;
		background: rgba(22,22,24,.92);
		border-radius: 0 0 .5rem .5rem;
		transform: translateX(-50%);
	}

	.notch > span { opacity: 0; transition: opacity .2s ease; }
	.notch:hover > span { opacity: 1; }
</style>
