import { Notifications } from 'expo';

export type noticeState = {
	[ id: string ]: number
}

const selectors = {
	create: 'createNotice',
	delete: 'deleteNotice'
};

export const noticeActions = {
	createNotice( itemId: string, noticeId: number, localId: number ) {
		return { type: selectors.create, itemId, noticeId, localId };
	},
	deleteNotice( itemId: string ) {
		return { type: selectors.delete, itemId };
	}
};

export default function noticeStore( state: noticeState = {}, action ): noticeState {
	switch ( action.type ) {
	case 'reset':
		Notifications.cancelAllScheduledNotificationsAsync();
		return {};
	case 'createNotice':
		if ( !action.noticeId ) return state;
		return { ...state, [ action.itemId ]: action.noticeId };
	case 'deleteNotice':
		state = { ...state };
		delete state[ action.itemId ];
		return state;
	}
	
	return state;
}

export function localNoticeStore( state: noticeState = {}, action ): noticeState {
	switch ( action.type ) {
	case 'reset':
		for ( const id in state )
			clearTimeout( state[ id ] );
		return {};
	case selectors.create:
		if ( !action.localId ) return state;
		return { ...state, [ action.itemId ]: action.localId };
	case selectors.delete:
		state = { ...state };
		delete state[ action.itemId ];
		return state;
	}
	
	return state;
}
