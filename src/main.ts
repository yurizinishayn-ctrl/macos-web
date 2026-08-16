import { mount } from 'svelte';
import Desktop from './components/Desktop/Desktop.svelte';
import './css/global.css';

const target = document.getElementById('root');

if (!target) {
	throw new Error('macOS Web: #root element was not found.');
}

try {
	const desktop = mount(Desktop, { target });
	export default desktop;
} catch (error) {
	console.error('macOS Web failed to mount:', error);
	target.innerHTML = `
		<div class="macos-fatal-error">
			<div class="macos-fatal-card">
				<div class="macos-fatal-icon"></div>
				<h1>macOS Web não conseguiu iniciar</h1>
				<p>O aplicativo encontrou um erro ao montar o desktop.</p>
				<pre>${String(error)}</pre>
				<button id="reset-macos-web">Redefinir dados locais</button>
			</div>
		</div>
	`;

	document.getElementById('reset-macos-web')?.addEventListener('click', () => {
		localStorage.clear();
		sessionStorage.clear();
		location.reload();
	});
}
