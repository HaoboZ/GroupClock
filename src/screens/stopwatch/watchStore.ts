import { watchItemData } from './WatchItem';

export type watchState = {
	[ id: string ]: watchItemData
}

const selectors = {
	reset:  'resetWatch',
	save:   'saveWatch',
	delete: 'deleteWatch'
};

export const watchActions = {
	resetWatch() {
		return { type: selectors.reset };
	},
	saveWatch( itemId: string, item: any ) {
		return { type: selectors.save, itemId, item };
	},
	deleteWatch( itemId: string ) {
		return { type: selectors.delete, itemId };
	}
};

export default function watchStore( state: watchState = {}, action ): watchState {
	switch ( action.type ) {
	case 'reset':
	case selectors.reset:
		if ( action.state )
			return action.state.stopwatch;
		return {};
	case selectors.save:
		return { ...state, [ action.itemId ]: { ...action.item, id: action.itemId } };
	case selectors.delete:
		state = { ...state };
		delete state[ action.itemId ];
		return state;
	}
	
	return state;
};
