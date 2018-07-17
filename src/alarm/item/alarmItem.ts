import AlarmStorage from '../alarmStorage';
import Item from './item';
import alarm from '../alarm';

export type alarmItemData = {
	type: 'alarm',
	parent: string,
	label: string,
	time: string,
	repeat: Array<boolean>,
	active: boolean,
	update: number
}

export default class AlarmItem extends Item<alarmItemData> {
	
	/**
	 * Adds alarm to {@link alarmAll}.
	 *
	 * @param {alarmItemData} data
	 * @returns {Promise<void>}
	 */
	public create( data: alarmItemData ): Promise<void> {
		AlarmStorage.setAlarmAll( this.key, true ).then();
		return super.create( data );
	}
	
	/**
	 * Deletes alarm from {@link alarmAll} and {@link alarmSingle}.
	 *
	 * @returns {Promise<void>}
	 */
	public delete(): Promise<void> {
		AlarmStorage.setAlarmAll( this.key, false ).then();
		AlarmStorage.setAlarmSingle( this.key, false ).then();
		return super.delete();
	}
	
	/**
	 * Sets alarm in {@link alarmSingle}.
	 *
	 * @param {boolean} active
	 * @returns {Promise<void>}
	 */
	public activate( active: boolean ): Promise<void> {
		AlarmStorage.setAlarmSingle( this.key, active ).then();
		return super.activate( active );
	}
	
	public static convert = {
		/**
		 * Converts to component storable and viewable format.
		 *
		 * @param {Array<number>} array
		 * @returns {Array<boolean>}
		 */
		fillArray( array: Array<number> ): Array<boolean> {
			let res = [];
			for ( let i = 0; i < 7; ++i )
				res[ i ] = array.includes( i );
			return res;
		},
		/**
		 * Converts to component editable format.
		 *
		 * @param {Array<boolean>} array
		 * @returns {Array<number>}
		 */
		emptyArray( array: Array<boolean> ): Array<number> {
			let res = [];
			for ( let i = 0; i < 7; ++i )
				if ( array[ i ] )
					res.push( i );
			return res;
		}
	};
	
}