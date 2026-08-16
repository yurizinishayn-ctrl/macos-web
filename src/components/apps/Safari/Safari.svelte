<script lang="ts">
	let url = $state('https://www.google.com/search?igu=1');
	let inputUrl = $state('google.com');
	let canGoBack = $state(false);
	let canGoForward = $state(false);
	let frame = $state<HTMLIFrameElement>();

	function normalize(value: string) {
		const raw = value.trim();
		if (!raw) return 'https://www.google.com/search?igu=1';
		if (/^https?:\/\//i.test(raw)) return raw;
		if (/^[\w.-]+\.[a-z]{2,}(\/.*)?$/i.test(raw)) return `https://${raw}`;
		return `https://www.google.com/search?igu=1&q=${encodeURIComponent(raw)}`;
	}

	function navigate(value = inputUrl) {
		const target = normalize(value);
		inputUrl = target.includes('google.com/search') ? new URL(target).searchParams.get('q') || 'google.com' : target;
		url = target;
		canGoBack = true;
		canGoForward = false;
	}

	function goBack() {
		try { frame?.contentWindow?.history.back(); canGoBack = false; } catch { /* cross-origin */ }
	}

	function goForward() {
		try { frame?.contentWindow?.history.forward(); canGoForward = false; } catch { /* cross-origin */ }
	}

	function reload() {
		if (frame) frame.src = url;
	}

	function openExternal() {
		window.open(url, '_blank', 'noopener,noreferrer');
	}
</script>

<div class="safari-container">
	<header class="toolbar app-window-drag-handle">
		<div class="toolbar-actions">
			<button class="round" aria-label="Voltar" title="Voltar" onclick={goBack}>‹</button>
			<button class="round" aria-label="Avançar" title="Avançar" onclick={goForward}>›</button>
			<button class="round" aria-label="Recarregar" title="Recarregar" onclick={reload}>↻</button>
		</div>
		<form class="address-wrap" onsubmit={(e) => { e.preventDefault(); navigate(); }}>
			<div class="address-glass">
				<span class="lock">⌕</span>
				<input bind:value={inputUrl} aria-label="Endereço ou busca" placeholder="Pesquisar ou digitar endereço" />
				<button type="submit" class="go">Ir</button>
			</div>
		</form>
		<button class="share round" aria-label="Abrir fora do Safari" title="Abrir no navegador" onclick={openExternal}>↗</button>
	</header>

	<div class="content">
		<iframe bind:this={frame} src={url} title="Safari Web View" allow="clipboard-read; clipboard-write" sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"></iframe>
		<div class="fallback">
			<button onclick={() => navigate('https://www.google.com')}>Abrir Google</button>
		</div>
	</div>
</div>

<style>
	.safari-container { display:flex; flex-direction:column; width:100%; height:100%; overflow:hidden; background:color-mix(in srgb,var(--system-color-light) 94%,transparent); color:var(--system-color-light-contrast); }
	.toolbar { display:flex; align-items:center; gap:.6rem; padding:.55rem .7rem; min-height:3.15rem; background:linear-gradient(180deg,rgba(255,255,255,.34),rgba(255,255,255,.16)); border-bottom:1px solid rgba(255,255,255,.42); backdrop-filter:blur(22px) saturate(150%); -webkit-backdrop-filter:blur(22px) saturate(150%); }
	.toolbar-actions { display:flex; gap:.25rem; }
	.round { width:2rem; height:2rem; border:1px solid rgba(255,255,255,.42); background:rgba(255,255,255,.22); color:inherit; border-radius:999px; display:grid; place-items:center; font-size:1rem; box-shadow:inset 0 1px 0 rgba(255,255,255,.35); }
	.round:hover { background:rgba(255,255,255,.38); }
	.address-wrap { flex:1; }
	.address-glass { display:flex; align-items:center; gap:.45rem; min-height:2rem; padding:0 .35rem .0rem .75rem; border:1px solid rgba(255,255,255,.48); border-radius:999px; background:rgba(255,255,255,.34); box-shadow:inset 0 1px 0 rgba(255,255,255,.55),0 2px 12px rgba(0,0,0,.07); }
	.address-glass input { flex:1; min-width:0; background:transparent; border:0; outline:0; color:inherit; text-align:center; font:inherit; font-size:.9rem; }
	.address-glass input:focus { text-align:left; }
	.lock { opacity:.55; }
	.go { border:0; border-radius:999px; padding:.3rem .65rem; background:rgba(10,132,255,.9); color:white; font-size:.76rem; }
	.content { position:relative; flex:1; min-height:0; background:#fff; }
	iframe { width:100%; height:100%; border:0; background:#fff; }
	.fallback { position:absolute; right:.8rem; bottom:.8rem; pointer-events:none; opacity:.9; }
	.fallback button { pointer-events:auto; border:1px solid rgba(255,255,255,.5); border-radius:999px; padding:.4rem .7rem; background:rgba(255,255,255,.78); backdrop-filter:blur(12px); }
	@media (max-width:700px){ .toolbar-actions .round:nth-child(2){display:none}.toolbar{gap:.35rem}.round{width:1.8rem;height:1.8rem} }
</style>
