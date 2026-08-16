import type { apps_config } from '🍎/configs/apps/apps-config';

export type AppID = keyof typeof apps_config;

const appIds = Object.keys(apps_config) as AppID[];
const createBooleanRecord = (initial = false) =>
	Object.fromEntries(appIds.map((id) => [id, initial])) as Record<AppID, boolean>;
const createNumberRecord = (initial = 0) =>
	Object.fromEntries(appIds.map((id) => [id, initial])) as Record<AppID, number>;

export const apps = $state({
	open: {
		...createBooleanRecord(),
		finder: true,
		'view-source': true,
	} as Record<AppID, boolean>,

	active: 'finder' satisfies AppID,

	/** Maximum z-index assigned to the active application. */
	active_z_index: -2,

	z_indices: createNumberRecord(),

	is_being_dragged: false,

	fullscreen: createBooleanRecord(),
});
