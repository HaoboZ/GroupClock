import * as _ from 'lodash';
import moment from 'moment-timezone';
import { folderListItem, FolderListType } from '../../pages/FolderList';
import store from '../../store/store';
import Notice from '../../utils/notice/Notice';
import AlarmGroup from './AlarmGroup';
import { alarmActions } from './alarmStore';

export enum State {
	OFF,
	ON
}

export type alarmItemData = {
	id: string
	state: State
	targetTime: number
	time: number
	repeatDays: boolean[]
};

export default class AlarmItem {
	
	item: folderListItem;
	data: alarmItemData;
	
	static Initial( list: folderListItem ) {
		const time = moment().tz( new AlarmGroup( list ).timezone );
		return {
			targetTime: time.hour() * 60 + time.minute(),
			repeatDays: [ false, false, false, false, false, false, false ]
		};
	}
	static create( id: string, itemData: alarmItemData ) {
		// values reset when editing
		itemData.state = State.OFF;
		store.dispatch( alarmActions.saveAlarm( id, itemData ) );
		// reset notifications
		if ( itemData.id )
			new AlarmItem( store.getState().folderList[ id ] ).notificationSet();
		return itemData;
	}
	
	static reset() {
		for ( const id in store.getState().alarm ) {
			const alarm = new AlarmItem( store.getState().folderList[ id ] );
			if ( alarm.data.state !== State.ON ) continue;
			
			if ( !_.some( alarm.data.repeatDays ) ) {
				if ( moment( alarm.data.time ).isBefore() )
					alarm.offAction();
			} else
				alarm.notificationSet();
		}
	}
	
	constructor( item: folderListItem ) {
		this.item = item;
		this.data = store.getState().alarm[ item.id ] as alarmItemData;
		if ( !this.data.repeatDays ) this.data.repeatDays = [];
		if ( !( this.data.repeatDays instanceof Array ) ) this.data.repeatDays = Object.values( this.data.repeatDays );
	}
	
	public async offAction() {
		if ( this.data.state === State.ON ) {
			this.data.state = State.OFF;
			store.dispatch( alarmActions.saveAlarm( this.data.id, this.data ) );
			await this.notificationSet();
		}
	};
	public async onAction() {
		if ( this.data.state === State.OFF ) {
			this.data.state = State.ON;
			store.dispatch( alarmActions.saveAlarm( this.data.id, this.data ) );
			this.data.time = await this.notificationSet();
		}
	};
	
	public static disableChildren( list: folderListItem ) {
		if ( list.type !== FolderListType.Group ) {
			new AlarmItem( list ).offAction();
			return;
		}
		for ( const id in list.items )
			this.disableChildren( store.getState().folderList[ id ] );
	}
	
	public delete() {
		this.data.state = State.OFF;
		store.dispatch( alarmActions.deleteAlarm( this.data.id ) );
		this.notificationSet();
	}
	
	public async notificationSet() {
		if ( this.data.state === State.ON ) {
			const timezone = new AlarmGroup( store.getState().folderList[ this.item.parent ] ).timezone,
			      time     = moment().tz( timezone ).startOf( 'day' )
				      .hour( this.data.targetTime / 60 ).minute( this.data.targetTime % 60 );
			while ( time.isBefore() )
				time.add( 1, 'day' );
			
			let single = true;
			for ( let i = 0; i < 7; ++i ) {
				const day = time.day();
				if ( !this.data.repeatDays[ day ] )
					await Notice.delete( day + '-' + this.item.id );
				else {
					await Notice.create( {
						itemId: day + '-' + this.item.id,
						title:  'Alarm',
						body:   this.item.name,
						time:   time.diff(),
						repeat: 'week'
					} );
					single = false;
				}
				time.add( 1, 'day' );
			}
			time.subtract( 7, 'day' );
			if ( single ) {
				await Notice.create( {
					itemId:     '0-' + this.item.id,
					title:      'Alarm',
					body:       this.item.name,
					time:       time.diff(),
					onComplete: () => {
						Object.assign( this.data, {
							state:      State.OFF,
							targetTime: 0
						} );
						store.dispatch( alarmActions.saveAlarm( this.data.id, this.data ) );
					}
				} );
				return +time;
			}
		} else
			for ( let i = 0; i < 7; ++i )
				await Notice.delete( i + '-' + this.item.id );
	}
	
}
