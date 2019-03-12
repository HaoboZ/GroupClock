import { folderListItem } from '../FolderList';

export type folderListState = {
	[ id: string ]: folderListItem
}

const selectors = {
	save:   'saveFolderList',
	delete: 'deleteFolderList'
};

export const folderListActions = {
	saveItem( itemId: string, item: folderListItem ) {
		return { type: selectors.save, itemId, item };
	},
	deleteItem( itemId: string ) {
		return { type: selectors.delete, itemId };
	}
};

export default function folderListStore( state: folderListState = {}, action ): folderListState {
	switch ( action.type ) {
	case 'reset':
		if ( action.state ) {
			return action.state.folderList;
		}
		return {};
	case selectors.save:
		console.log( 'inner saved' );
		return { ...state, [ action.itemId ]: { ...action.item, id: action.itemId } };
	case selectors.delete:
		state = { ...state };
		delete state[ action.itemId ];
		return state;
	}
	
	return state;
};
