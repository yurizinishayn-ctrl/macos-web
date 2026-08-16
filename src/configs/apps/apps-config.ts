import Safari from '🍎/components/apps/Safari/Safari.svelte';

export const apps_config = {
  finder: {
    id: 'finder', title: 'Finder', icon: 'finder', disabled: false, faded: false,
    showInDock: true, showInAppStore: false, height: 500, width: 700,
  },
  safari: {
    id: 'safari', title: 'Safari', icon: 'safari', disabled: false, faded: false,
    showInDock: true, showInAppStore: true, height: 600, width: 900, component: Safari,
  },
  calculator: {
    id: 'calculator', title: 'Calculator', icon: 'calculator', disabled: false, faded: false,
    showInDock: true, showInAppStore: true, height: 400, width: 300,
  },
  vscode: {
    id: 'vscode', title: 'VS Code', icon: 'vscode', disabled: false, faded: false,
    showInDock: true, showInAppStore: true, height: 600, width: 800,
  },
  appstore: {
    id: 'appstore', title: 'App Store', icon: 'appstore', disabled: false, faded: false,
    showInDock: true, showInAppStore: false, height: 550, width: 750,
  },
};

export const appsConfig = apps_config;
export const apps = apps_config;
export default apps_config;
