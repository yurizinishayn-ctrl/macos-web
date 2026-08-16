import Safari from '$components/apps/Safari/Safari.svelte';

/**
 * Applications available to the macOS web desktop.
 *
 * Keep app metadata in one place so the Dock, window manager and App Store
 * can all use the same source of truth.
 */
export const apps_config = {
	finder: {
		id: 'finder',
		title: 'Finder',
		icon: 'finder',
		disabled: false,
		faded: false,
		showInDock: true,
		showInAppStore: false,
		resizable: true,
		expandable: true,
		height: 520,
		width: 760,
	},
	safari: {
		id: 'safari',
		title: 'Safari',
		icon: 'safari',
		disabled: false,
		faded: false,
		showInDock: true,
		showInAppStore: true,
		resizable: true,
		expandable: true,
		height: 620,
		width: 980,
		component: Safari,
	},
	calculator: {
		id: 'calculator',
		title: 'Calculator',
		icon: 'calculator',
		disabled: false,
		faded: false,
		showInDock: true,
		showInAppStore: true,
		resizable: false,
		expandable: false,
		height: 430,
		width: 330,
	},
	calendar: {
		id: 'calendar',
		title: 'Calendar',
		icon: 'calendar',
		disabled: false,
		faded: false,
		showInDock: true,
		showInAppStore: true,
		resizable: true,
		expandable: true,
		height: 620,
		width: 860,
	},
	wallpapers: {
		id: 'wallpapers',
		title: 'Wallpaper',
		icon: 'wallpapers',
		disabled: false,
		faded: false,
		showInDock: false,
		showInAppStore: true,
		resizable: true,
		expandable: true,
		height: 620,
		width: 900,
	},
	vscode: {
		id: 'vscode',
		title: 'VS Code',
		icon: 'vscode',
		disabled: false,
		faded: false,
		showInDock: true,
		showInAppStore: true,
		resizable: true,
		expandable: true,
		height: 650,
		width: 1000,
	},
	appstore: {
		id: 'appstore',
		title: 'App Store',
		icon: 'appstore',
		disabled: false,
		faded: false,
		showInDock: true,
		showInAppStore: false,
		resizable: true,
		expandable: true,
		height: 600,
		width: 820,
	},
} as const;

export const appsConfig = apps_config;
export const apps = apps_config;
export default apps_config;
