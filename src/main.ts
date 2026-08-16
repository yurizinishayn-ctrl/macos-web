import { mount } from 'svelte';
import './css/global.css';
import './configs/wallpapers/legacy-macos-wallpapers.ts';

const target = document.getElementById('root');

function showStartupError(error: unknown) {
	console.error('macOS Web failed to start:', error);

	if (!target) return;

	target.innerHTML = `
		<div style="min-height:100vh;display:grid;place-items:center;padding:24px;background:linear-gradient(135deg,#14161b,#252a33);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;color:#fff">
			<div style="width:min(680px,92vw);padding:32px;border:1px solid rgba(255,255,255,.14);border-radius:22px;background:rgba(28,30,35,.82);box-shadow:0 24px 80px rgba(0,0,0,.45);backdrop-filter:blur(24px)">
				<div style="font-size:48px;margin-bottom:12px"></div>
				<h1 style="margin:0 0 8px;font-size:24px">macOS Web não conseguiu iniciar</h1>
				<p style="margin:0 0 18px;color:#bfc4cc">Detectei um erro durante a inicialização. Use o botão abaixo para limpar dados antigos do navegador e tentar novamente.</p>
				<pre style="white-space:pre-wrap;overflow:auto;max-height:220px;padding:14px;border-radius:12px;background:#0c0d10;color:#ffb4b4;font:12px/1.5 ui-monospace,SFMono-Regular,Menlo,monospace">${String(error)}</pre>
				<button id="reset-macos-web" style="margin-top:16px;padding:10px 16px;border:0;border-radius:12px;background:#0a84ff;color:white;font-weight:600;cursor:pointer">Redefinir e recarregar</button>
			</div>
		</div>
	`;

	document.getElementById('reset-macos-web')?.addEventListener('click', () => {
		localStorage.clear();
		sessionStorage.clear();
		location.reload();
	});
}

if (!target) {
	throw new Error('macOS Web: #root element was not found.');
}

try {
	const { default: Desktop } = await import('./components/Desktop/Desktop.svelte');
	mount(Desktop, { target });
} catch (error) {
	showStartupError(error);
}
