import Storage from '../extend/storage';
import moment from 'moment-timezone';

import AlarmItem from './item/alarmItem';

export default class AlarmStorage {
	
	static alarms: { [ key: string ]: boolean };
	static singleAlarms: { [ key: string ]: boolean };
	
	static async init() {
		this.alarms = await Storage.getItem( 'alarms' ) || {};
		this.singleAlarms = await Storage.getItem( '' ) || {};
		await this.update();
	}
	
	static async update() {
		let time = moment().unix();
		for ( let key in this.singleAlarms ) {
			let item = new AlarmItem( key );
			if ( !await item.load )
				return;
			
			if ( item.data.update >= time )
				item.delete().then();
		}
	}
	
}
