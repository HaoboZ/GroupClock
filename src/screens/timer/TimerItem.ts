import moment from 'moment-timezone';
import { folderListItem } from '../../pages/FolderList';
import store from '../../store/store';
import Notice from '../../utils/notice/Notice';
import { power } from '../home/settings/settingsStore';
import { timerActions } from './timerStore';

export enum State {
	OFF,
	ON,
	PAUSED
}

export type timerItemData = {
	id: string
	state: State
	setTime: number
	targetTime: number
	savedTime: number
	repeat: number
	repeatNum: number
};

export default class TimerItem {
	
	item: folderListItem;
	data: timerItemData;
	
	// values that can be changed by editing
	static get Initial() {
		return {
			setTime: 300,
			repeat:  1
		};
	}
	static create( id: string, itemData: timerItemData ) {
		// values reset when editing
		itemData = Object.assign( itemData, {
			state:      State.OFF,
			targetTime: 0,
			savedTime:  0,
			repeatNum:  0
		} );
		store.dispatch( timerActions.saveTimer( id, itemData ) );
		// reset notifications
		if ( itemData.id )
			new TimerItem( store.getState().folderList[ id ] ).notificationSet();
		return itemData;
	}
	
	static reset() {
		for ( const id in store.getState().timer ) {
			const timer = new TimerItem( store.getState().folderList[ id ] );
			if ( timer.data.state !== State.ON ) continue;
			
			if ( moment( timer.data.targetTime ).isBefore() )
				timer.offAction();
			else
				timer.notificationSet();
		}
	}
	
	constructor( item: folderListItem ) {
		this.item = item;
		this.data = store.getState().timer[ item.id ] as timerItemData;
	}
	
	public timeString( time: number ) {
		let val;
		switch ( this.data.state ) {
		case State.OFF:
			val = this.data.setTime * 1000;
			break;
		case State.ON:
			val = this.data.targetTime - time;
			break;
		case State.PAUSED:
			val = this.data.savedTime;
			break;
		}
		return this.toString( Math.min( this.data.setTime * 1000, val ) );
	}
	
	public async leftAction() {
		switch ( this.data.state ) {
		case State.OFF:
			return;
		case State.ON:
		case State.PAUSED:
			Object.assign( this.data, {
				state:      State.OFF,
				targetTime: 0,
				savedTime:  0,
				repeatNum:  0
			} );
			break;
		}
		store.dispatch( timerActions.saveTimer( this.data.id, this.data ) );
		await this.notificationSet();
	}
	public async rightAction() {
		switch ( this.data.state ) {
		case State.OFF:
			Object.assign( this.data, {
				state:      State.ON,
				targetTime: Date.now() + this.data.setTime * 1000
			} );
			break;
		case State.ON:
			Object.assign( this.data, {
				state:      State.PAUSED,
				savedTime:  this.data.targetTime - Date.now(),
				targetTime: 0
			} );
			break;
		case State.PAUSED:
			Object.assign( this.data, {
				state:      State.ON,
				targetTime: Date.now() + this.data.savedTime,
				savedTime:  0
			} );
			break;
		}
		store.dispatch( timerActions.saveTimer( this.data.id, this.data ) );
		await this.notificationSet();
	};
	public rightChainAction( sum ) {
		let val = 0;
		switch ( this.data.state ) {
		case State.OFF:
			val = this.data.setTime * 1000 * this.data.repeat;
			Object.assign( this.data, {
				state:      State.ON,
				targetTime: sum + this.data.setTime * 1000
			} );
			break;
		case State.ON:
			Object.assign( this.data, {
				state:      State.PAUSED,
				savedTime:  this.data.targetTime - Date.now(),
				targetTime: 0
			} );
			break;
		case State.PAUSED:
			Object.assign( this.data, {
				state:      State.ON,
				targetTime: Date.now() + this.data.savedTime,
				savedTime:  0
			} );
			break;
		}
		store.dispatch( timerActions.saveTimer( this.data.id, this.data ) );
		this.notificationSet();
		return val;
	};
	public async offAction() {
		Object.assign( this.data, {
			state:      State.OFF,
			targetTime: 0,
			savedTime:  0
		} );
		store.dispatch( timerActions.saveTimer( this.data.id, this.data ) );
		await this.notificationSet();
	}
	
	public delete() {
		this.data.state = State.OFF;
		store.dispatch( timerActions.deleteTimer( this.data.id ) );
		this.notificationSet();
	}
	
	public async notificationSet() {
		if ( this.data.state === State.ON ) {
			let time = this.data.targetTime - Date.now();
			const repeat = this.data.repeat - 1 - this.data.repeatNum;
			
			for ( let i = 0; i < 10; ++i ) {
				if ( i <= repeat ) {
					await Notice.create( {
						itemId:     i + '-' + this.item.id,
						title:      'Timer',
						body:       this.item.name,
						time,
						onComplete: () => {
							if ( i !== repeat )
								Object.assign( this.data, {
									targetTime: Date.now() + this.data.setTime * 1000,
									repeatNum:  i + 1
								} );
							else
								Object.assign( this.data, {
									state:      State.OFF,
									targetTime: 0,
									savedTime:  0,
									repeatNum:  0
								} );
							store.dispatch( timerActions.saveTimer( this.data.id, this.data ) );
						}
					} );
					time += this.data.setTime * 1000;
				} else
					await Notice.delete( i + '-' + this.item.id );
			}
		} else
			for ( let i = 0; i < 10; ++i )
				await Notice.delete( i + '-' + this.item.id );
	}
	
	public toString( time: number ) {
		const duration = moment.duration( Math.max( 0, time ) );
		if ( store.getState().settings.precision === power.low )
			return duration.format( 'h:mm:ss', { stopTrim: 'm' } );
		else
			return duration.format( 'h:mm:ss.SS', { stopTrim: 'm' } );
	}
	
}
