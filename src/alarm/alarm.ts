import createNavigator from '../extend/createNavigator';
import Storage from '../extend/storage';

import AlarmList from './alarmList';
import AddItem from './modify/addItem';
import EditAlarm from './modify/editAlarm';
import EditGroup from './modify/editGroup';
import Item from './items/item';
import GroupItem from "./items/groupItem";


export let alarms: { [ key: string ]: boolean };
export let singleAlarms: Array<string>;

export async function saveAlarms() {
	await Storage.setItem( 'alarms', alarms );
}

export async function saveSingleAlarms() {
	await Storage.setItem( 'singleAlarms', singleAlarms );
}

AlarmList.initial = new Promise( async ( res ) => {
	alarms = await Storage.getItem( 'alarms' );
	if ( !alarms )
		alarms = {};
	
	singleAlarms = await Storage.getItem( 'singleAlarms' );
	if ( !singleAlarms )
		singleAlarms = [];
	
	for ( let _item in singleAlarms ) {
		let item = await GroupItem.getNew( _item, true ) as Item;
		if ( !item )
			continue;
		await item.load();
		// TODO: find each alarm where time has passed and remove the active
		// TODO: set timer for each item to update state
	}
	
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
