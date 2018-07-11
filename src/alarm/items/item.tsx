import React from 'react';

import Storage from '../../extend/storage';
import AlarmItem from './alarmItem';
import GroupItem from './groupItem';

export const itemType = {
	Alarm: 0,
	Group: 1
};

export async function load( key, obj = false, alarmProps = {}, groupProps = {} ): Promise<AlarmItem | GroupItem | JSX.Element> {
	return await Storage.getItem( key ).then( async data => {
		if ( !data )
			return null;
		
		switch ( data.type ) {
		case 'Alarm':
			if ( obj )
				return new AlarmItem( { k: key } );
			else
				return <AlarmItem key={key} k={key} {...alarmProps}/>;
		case 'Group':
			if ( obj )
				return new GroupItem( { k: key } );
			else
				return <GroupItem key={key} k={key} {...groupProps}/>;
		default:
			return null;
		}
	} );
}

/**
 * Creates a new item and adds it to parent.
 *
 * @param state
 * @param {string} parentKey
 * @returns {Promise<void>}
 */
export async function save( state: any, parentKey: string ) {
	let item: AlarmItem | GroupItem;
	
	if ( state.type === itemType.Alarm ) {
		item = await AlarmItem.create(
			null,
			state.alarmLabel,
			AlarmItem.dateToTime( state.time ),
			AlarmItem.fillArray( state.repeat )
		);
	} else {
		item = await GroupItem.create(
			null,
			state.groupLabel,
			state.tz,
			[]
		);
	}
	
	// Retrieves parent info from storage
	let parent = new GroupItem( { k: parentKey } );
	await parent.load();
	// adds key to items
	parent.state.items.push( item.key );
	await parent.save().catch( () => alert( 'An error has occurred' ) );
}