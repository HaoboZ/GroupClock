import React from 'react';
import Storage from '../../extend/storage';
import { color } from '../../styles';
import { ListItem } from 'react-native-elements';

export default class AlarmItem extends React.PureComponent {
	
	props: {
		k: string
	};
	
	state = {
		type:   '',
		label:  '',
		time:   '',
		repeat: [],
		active: false
	};
	
	key: string;
	
	constructor( props ) {
		super( props );
		
		this.key = props.k;
	}
	
	componentDidMount() {
		this.load().then();
	}
	
	public static async create( key, label, time, repeat ): Promise<AlarmItem> {
		if ( key === null )
			key = Math.random().toString( 36 ).substring( 2, 12 );
		let data = { type: 'Alarm', label, time, repeat, active: false };
		await Storage.setItem( key, data );
		return new AlarmItem( { k: key } );
	}
	
	public async load( direct = false ) {
		await Storage.getItem( this.key ).then( data => {
			if ( data ) {
				if ( direct )
					this.state = data;
				else
					this.setState( data );
			}
		} );
		return this;
	}
	
	/**
	 * Saves data.
	 * TODO: turn on notifications here
	 * @returns {Promise<void>}
	 */
	public save(): Promise<void> {
		return Storage.mergeItem( this.key,
			{
				label:  this.state.label,
				time:   this.state.time,
				repeat: this.state.repeat,
				active: this.state.active
			} );
	}
	
	render() {
		return <ListItem
			containerStyle={[ color.listItem ]}
			bottomDivider
			title={this.state.label}
			titleStyle={[ color.foreground, { fontSize: 42 } ]}
			subtitle={this.state.time}
			subtitleStyle={[ color.foreground ]}
			switch={{
				value:         this.state.active,
				onValueChange: ( value ) => {
					this.state.active = value;
				}
			}}
		/>
	}
	
	public static dateToTime( date: Date ): string {
		return date.getHours() + ':' + ( '0' + date.getMinutes() ).slice( -2 );
	}
	
	public static fillArray( array ): Array<boolean> {
		let res = [];
		for ( let i = 0; i < 7; ++i )
			res[ i ] = array.includes( i );
		return res;
	}
	
}