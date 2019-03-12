import { timerGroupData } from './TimerGroup';
import { timerItemData } from './TimerItem';

export type timerState = {
	[ id: string ]: timerItemData | timerGroupData
}

const selectors = {
	reset:  'resetTimer',
	save:   'saveTimer',
	delete: 'deleteTimer'
};

export const timerActions = {
	resetTimer() {
		return { type: selectors.reset };
	},
	saveTimer( itemId: string, item: any ) {
		return { type: selectors.save, itemId, item };
	},
	deleteTimer( itemId: string ) {
		return { type: selectors.delete, itemId };
	}
};

export default function timerStore( state: timerState = {}, action ): timerState {
	switch ( action.type ) {
	case 'reset':
	case selectors.reset:
		if ( action.state )
			return action.state.timer;
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
