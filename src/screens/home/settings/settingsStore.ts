export enum themes {
	light,
	dark
}

export type settingsState = {
	permission: boolean
	time: number
	theme: themes
	timezone: string
}

const selectors = {
	update:     'update',
	permission: 'permission',
	theme:      'theme',
	timezone:   'timezone'
};

export const settingsActions = {
	reset() {
		return { type: 'reset' };
	},
	update() {
		return { type: selectors.update };
	},
	permission( permission: boolean ) {
		return { type: selectors.permission, permission };
	},
	theme( theme: themes ) {
		return { type: selectors.theme, theme };
	},
	timezone( timezone: string ) {
		return { type: selectors.timezone, timezone };
	}
};

const initialState: settingsState = {
	permission: false,
	time:       Date.now(),
	theme:      themes.light,
	timezone:   'Default'
};

export default function settingsStore( state: settingsState = initialState, action ) {
	switch ( action.type ) {
	case 'reset':
		return initialState;
	case selectors.update:
		return { ...state, time: Date.now() };
	case selectors.permission:
		return { ...state, permission: action.permission };
	case selectors.theme:
		return { ...state, theme: action.theme };
	case selectors.timezone:
		return { ...state, timezone: action.timezone };
	}
	
	return state;
};
