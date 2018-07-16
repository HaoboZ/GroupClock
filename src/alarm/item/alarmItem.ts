import Item from './item';

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
	
	public static convert = {
		fillArray( array: Array<number> ): Array<boolean> {
			let res = [];
			for ( let i = 0; i < 7; ++i )
				res[ i ] = array.includes( i );
			return res;
		},
		emptyArray( array: Array<boolean> ): Array<number> {
			let res = [];
			for ( let i = 0; i < 7; ++i )
				if ( array[ i ] )
					res.push( i );
			return res;
		}
	};
	
}