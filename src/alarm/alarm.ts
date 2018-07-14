import createNavigator from '../extend/createNavigator';
import moment from 'moment-timezone';
import Storage from '../extend/storage';

import AlarmList from './alarmList';
import AddItem from './modify/addItem';
import GroupItem from "./items/groupItem";
import AlarmItem from './items/alarmItem';
import EditGroup from './modify/editGroup';
import EditAlarm from './modify/editAlarm';

export class globals {
	static alarms: { [ key: string ]: boolean };
	static singleAlarms: Array<string>;
	
	static async saveAlarms(): Promise<void> {
		console.log( this.alarms );
		await Storage.setItem( 'alarms', this.alarms );
	}
	
	static async saveSingleAlarms(): Promise<void> {
		console.log( this.singleAlarms );
		await Storage.setItem( 'singleAlarms', this.singleAlarms );
	}
	
	static async removeSingleAlarm( key: string ): Promise<void> {
		let index = this.singleAlarms.indexOf( key );
		if ( index !== -1 ) {
			this.singleAlarms.splice( index, 1 );
			this.saveSingleAlarms().then();
		}
	}
	
	static async updateSingle(): Promise<void> {
		let time = moment().unix();
		for ( let [ index, _item ] of globals.singleAlarms.entries() ) {
			let item = await GroupItem.getNew( _item, true ) as AlarmItem;
			if ( !item )
				continue;
			await item.load();
			if ( item.state.update >= time )
				globals.singleAlarms.splice( index, 1 );
		}
	}
}

AlarmList.initial = new Promise( async ( res ) => {
	globals.alarms = await Storage.getItem( 'alarms' );
	if ( !globals.alarms )
		globals.alarms = {};
	
	globals.singleAlarms = await Storage.getItem( 'singleAlarms' );
	if ( !globals.singleAlarms )
		globals.singleAlarms = [];
	globals.updateSingle().then();
	
	res();
} );

export default createNavigator(
	{
		AlarmList,
		AddItem,
		EditGroup,
		EditAlarm
	}
);
