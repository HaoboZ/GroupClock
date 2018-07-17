import Storage from '../extend/storage';
import moment from 'moment-timezone';

import AlarmItem from './item/alarmItem';

/**
 * Saves alarms that are added and removed.
 */
export default class AlarmStorage {
	
	/**
	 * Stores a list of all alarms.
	 */
	static alarmAll: Array<string>;
	/**
	 * Stores a list of all alarms are are non-repeating.
	 */
	static alarmSingle: Array<string>;
	
	/**
	 * Retrieves alarm lists from storage.
	 * Checks timestamps.
	 *
	 * @returns {Promise<void>}
	 */
	public static async init(): Promise<void> {
		this.alarmAll = await Storage.getItem( 'alarmAll' ) || [];
		this.alarmSingle = await Storage.getItem( 'alarmSingle' ) || [];
		await this.update();
	}
	
	/**
	 * Updates non-repeating alarms based on timestamps and current time.
	 * Removes completed alarms from {@link alarmSingle}.
	 *
	 * @returns {Promise<void>}
	 */
	public static async update(): Promise<void> {
		let time = moment().unix();
		for ( let key of this.alarmSingle ) {
			let item = new AlarmItem( key );
			await item.load;
			if ( item.data.update >= time )
				this.setAlarmSingle( item.key, false ).then();
		}
	}
	
	/**
	 * Remove or add an item from {@link alarmAll}.
	 *
	 * @param {string} key value to remove or add
	 * @param {boolean} add true to add, false to remove
	 * @returns {Promise<void>}
	 */
	public static async setAlarmAll( key: string, add: boolean ): Promise<void> {
		let index = this.alarmAll.indexOf( key );
		if ( add ) {
			if ( index !== -1 )
				return;
			this.alarmAll.push( key );
		} else {
			if ( index === -1 )
				return;
			this.alarmAll.splice( index, 1 );
		}
		await Storage.setItem( 'alarmAll', this.alarmAll );
	}
	
	/**
	 * Remove or add an item from {@link alarmSingle}.
	 *
	 * @param {string} key value to remove or add
	 * @param {boolean} add true to add, false to remove
	 * @returns {Promise<void>}
	 */
	public static async setAlarmSingle( key: string, add: boolean ): Promise<void> {
		let index = this.alarmSingle.indexOf( key );
		if ( add ) {
			if ( index !== -1 )
				return;
			this.alarmSingle.push( key );
		} else {
			if ( index === -1 )
				return;
			this.alarmSingle.splice( index, 1 );
		}
		await Storage.setItem( 'alarmSingle', this.alarmSingle );
	}
	
}
