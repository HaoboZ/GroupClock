import { folderListItem } from '../../pages/FolderList';
import store from '../../store/store';
import { timerActions } from './timerStore';

export enum activationType {
	All,
	Chain
}

export type timerGroupData = {
	id: string
	activate: activationType
};

export default class TimerGroup {
	
	item: folderListItem;
	data: timerGroupData;
	
	static get Initial() {
		return {
			activate: activationType.All
		};
	}
	static create( id: string, itemData: timerGroupData ) {
		store.dispatch( timerActions.saveTimer( id, itemData ) );
		return itemData;
	}
	
	constructor( item: folderListItem ) {
		this.item = item;
		this.data = store.getState().timer[ item.id ] as timerGroupData;
	}
	
	public delete() {
		store.dispatch( timerActions.deleteTimer( this.data.id ) );
	}
	
}
