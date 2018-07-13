import createNavigator from '../extend/createNavigator';
import Storage from '../extend/storage';

import AlarmList from './alarmList';
import AddItem from './modify/addItem';
import EditAlarm from './modify/editAlarm';
import EditGroup from './modify/editGroup';

import Item from './items/item';
import GroupItem from './items/groupItem';

export let activeAlarms: Array<string>;
export let singleActiveAlarms: Array<string>;

export async function saveActiveAlarms() {
	await Storage.setItem( 'activeAlarms', activeAlarms );
}

export async function saveSingleActiveAlarms() {
	await Storage.setItem( 'singleActiveAlarms', singleActiveAlarms );
}

AlarmList.initial = new Promise( async ( res ) => {
	activeAlarms = await Storage.getItem( 'activeAlarms' );
	if ( !activeAlarms )
		activeAlarms = [];
	
	singleActiveAlarms = await Storage.getItem( 'singleActiveAlarms' );
	if ( !singleActiveAlarms )
		singleActiveAlarms = [];
	
	for ( let _item of singleActiveAlarms ) {
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
