import React from 'react';

import Storage from '../../extend/storage';
import AlarmItem from './alarmItem';
import GroupItem from './groupItem';

export default async function load( key ): Promise<JSX.Element> {
	return await Storage.getItem( key ).then( async data => {
		if ( !data )
			return null;

		switch ( data.type ) {
		case 'Alarm':
			return <AlarmItem k={key}/>;
		case 'Group':
			return <GroupItem k={key}/>;
		default:
			return null;
		}
	} );
}