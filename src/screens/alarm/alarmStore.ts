import { alarmGroupData } from './AlarmGroup';
import { alarmItemData } from './AlarmItem';

export type alarmState = {
	[ id: string ]: alarmItemData | alarmGroupData
}

const selectors = {
	reset:  'resetAlarm',
	save:   'saveAlarm',
	delete: 'deleteAlarm'
};

export const alarmActions = {
	resetAlarm() {
		return { type: selectors.reset };
	},
	saveAlarm( itemId: string, item: any ) {
		return { type: selectors.save, itemId, item };
	},
	deleteAlarm( itemId: string ) {
		return { type: selectors.delete, itemId };
	}
};

export default function alarmStore( state: alarmState = {}, action ): alarmState {
	switch ( action.type ) {
	case 'reset':
	case selectors.reset:
		if ( action.state )
			return action.state.alarm;
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
