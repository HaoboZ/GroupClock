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

export const SwitchState = {
	off:     0,
	on:      1,
	partial: 2
};

export default class AlarmGroupItem extends Item<alarmGroupItemData> {
	
	async delete() {
		let data = await this.load;
		if ( !data ) {
			alert( '????' );
			return;
		}
		
		for ( let key of data.items ) {
			Item.load( key ).then( ( data: alarmGroupItemData | alarmItemData ) => {
				let item: AlarmItem | AlarmGroupItem;
				switch ( data.type ) {
				case 'alarm':
					item = new AlarmItem( key, true );
					break;
				case 'group':
					item = new AlarmGroupItem( key );
					break;
				}
				item.delete().then();
			} );
		}
		return super.delete();
	}
	
	async activate( active: number ) {
		await super.activate( active );
		for ( let key of this.data.items ) {
			Item.load( key ).then( async ( data: alarmGroupItemData | alarmItemData ) => {
				let item: AlarmItem | AlarmGroupItem;
				switch ( data.type ) {
				case 'alarm':
					item = new AlarmItem( key );
					item.activate( !!active ).then();
					break;
				case 'group':
					item = new AlarmGroupItem( key );
					item.activate( active ).then();
					break;
				}
			} );
		}
	}
	
	async getActive() {
		let state = SwitchState.off,
			 first = true;
		for ( let key of this.data.items ) {
			let item = new Item( key );
			await item.load;
			
			// first state initialize
			if ( first ) {
				state = item.data.active === true || item.data.active === SwitchState.on ? 1 : 0;
				first = false;
				continue;
			}
			// child states are different
			if ( state !== ( item.data.active === true || item.data.active === SwitchState.on ? 1 : 0 ) )
				return SwitchState.partial;
		}
		return state;
	}
	
}
