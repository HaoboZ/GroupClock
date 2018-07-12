import createNavigator from '../extend/createNavigator';
import Storage from '../extend/storage';

import AlarmList from './alarmList';
import AddItem from './modify/addItem';
import EditAlarm from './modify/editAlarm';
import EditGroup from './modify/editGroup';

import Item from './items/item';
import GroupItem from './items/groupItem';

AlarmList.initial = new Promise( ( res ) => {
	Storage.getItem( 'activeAlarms' ).then( async items => {
		if ( !items )
			await Storage.setItem( 'activeAlarms', [] );
	} );
	
	Storage.getItem( 'singleActiveAlarms' ).then( async items => {
		if ( !items ) {
			await Storage.setItem( 'singleActiveAlarms', [] );
			return;
		}
		
		for ( let _item of items ) {
			let item = await GroupItem.getNew( _item, true ) as Item;
			if ( !item )
				continue;
			await item.load();
			// TODO: find each alarm where time has passed and remove the active
			// TODO: set timer for each item to update state
		}
		
	} );
	
	setTimeout( res, 1000 );
} );

export default createNavigator(
	{
		AlarmList,
		AddItem,
		EditGroup,
		EditAlarm
	}
);
