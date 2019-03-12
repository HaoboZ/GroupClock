export enum themes {
	light,
	dark
}

export enum power {
	// noinspection JSUnusedGlobalSymbols
	low,
	med,
	high,
	extreme
}

export type settingsState = {
	permission: boolean
	theme: themes
	timezone: string
	precision: power
	persistence: boolean
}

const selectors = {
	permission:  'permission',
	theme:       'theme',
	timezone:    'timezone',
	precision:   'precision',
	persistence: 'persistence'
};

export const settingsActions = {
	reset( state = undefined ) {
		return { type: 'reset', state };
	},
	permission( permission: boolean ) {
		return { type: selectors.permission, permission };
	},
	theme( theme: themes ) {
		return { type: selectors.theme, theme };
	},
	timezone( timezone: string ) {
		return { type: selectors.timezone, timezone };
	},
	precision( precision: number ) {
		return { type: selectors.precision, precision };
	},
	persistence( persistence: boolean ) {
		return { type: selectors.persistence, persistence };
	}
};

const initialState: settingsState = {
	permission:  false,
	theme:       themes.light,
	timezone:    'Default',
	precision:   power.low,
	persistence: false
};

export default function settingsStore( state: settingsState = initialState, action ) {
	switch ( action.type ) {
	case 'reset':
		return initialState;
	case selectors.permission:
		return { ...state, permission: action.permission };
	case selectors.theme:
		return { ...state, theme: action.theme };
	case selectors.timezone:
		return { ...state, timezone: action.timezone };
	case selectors.precision:
		return { ...state, precision: action.precision };
	case selectors.persistence:
		return { ...state, persistence: action.persistence };
	}
	
	return state;
};
