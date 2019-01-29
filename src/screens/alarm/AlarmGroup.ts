import moment from 'moment-timezone';
import { folderListItem } from '../../pages/FolderList';
import store from '../../store/store';
import { alarmActions } from './alarmStore';

export type alarmGroupData = {
	id: string
	timezone: string
};

export default class AlarmGroup {
	
	item: folderListItem;
	data: alarmGroupData;
	
	static get Initial() {
		return {
			timezone: 'Default'
		};
	}
	static create( id: string, itemData: alarmGroupData ) {
		store.dispatch( alarmActions.saveAlarm( id, itemData ) );
		return itemData;
	}
	
	constructor( item: folderListItem ) {
		this.item = item;
		this.data = store.getState().alarm[ item.id ] as alarmGroupData;
	}
	
	public get timezone() {
		const { settings, folderList, alarm } = store.getState();
		
		let parent = this.data && this.data.id;
		while ( parent ) {
			const data = alarm[ parent ] as alarmGroupData;
			if ( data.timezone !== 'Default' ) return data.timezone;
			parent = folderList[ parent ].parent;
		}
		if ( settings.timezone !== 'Default' ) return settings.timezone;
		return moment.tz.guess();
	}
	
	public delete() {
		store.dispatch( alarmActions.deleteAlarm( this.data.id ) );
	}
	
}
