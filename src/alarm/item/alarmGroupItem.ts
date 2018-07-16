import Item from './item';
import { default as AlarmItem, alarmItemData } from './alarmItem';

export type alarmGroupItemData = {
	type: 'group',
	parent: string,
	label: string,
	tz: string,
	items: Array<string>,
	active: number
}

export default class AlarmGroupItem extends Item<alarmGroupItemData> {
	
	delete() {
		for ( let key of this.data.items ) {
			Item.load( key ).then( ( data: alarmGroupItemData | alarmItemData ) => {
				let item: AlarmItem | AlarmGroupItem;
				switch ( data.type ) {
				case 'alarm':
					item = new AlarmItem( key, true );
					break;
				case 'group':
					item = new AlarmGroupItem( key, true );
					break;
				}
				item.delete().then();
			} );
		}
		return super.delete();
	}
	
}
