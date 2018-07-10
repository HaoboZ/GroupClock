import React from 'react';
import Storage from '../../extend/storage';
import { color } from '../../styles';
import { ListItem } from 'react-native-elements';

export default class AlarmItem extends React.PureComponent {
	
	props: {
		k: string,
		onPress?: ( AlarmItem ) => void
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
	
	public async delete(): Promise<void> {
		await Storage.removeItem( this.key );
	}
	
	render() {
		if ( !this.state.type.length )
			return null;
		
		return <ListItem
			containerStyle={[ color.listItem ]}
			topDivider
			bottomDivider
			title={this.state.label}
			titleStyle={[ color.foreground, { fontSize: 42 } ]}
			subtitle={AlarmItem.timeTo12Hour( this.state.time )}
			subtitleStyle={[ color.foreground ]}
			onPress={this.onPress}
			switch={{
				value:         this.state.active,
				onValueChange: ( value ) => {
					this.state.active = value;
					this.save().then();
				}
			}}
		/>
	}
	
	onPress = () => {
		this.props.onPress( this );
	};
	
	public static dateToTime( date: Date ): string {
		return `${date.getHours()}:${( `0${date.getMinutes()}` ).slice( -2 )}`;
	}
	
	public static timeTo12Hour( time: string ): string {
		let parts = time.split( ':' );
		let hour = parseInt( parts[ 0 ] );
		return `${( hour + 11 ) % 12 + 1}:${parts[ 1 ]} ${( hour >= 12 ? 'PM' : 'AM' )}`;
	}
	
	public static fillArray( array: Array<number> ): Array<boolean> {
		let res = [];
		for ( let i = 0; i < 7; ++i )
			res[ i ] = array.includes( i );
		return res;
	}
	
	public static emptyArray( array: Array<boolean> ): Array<number> {
		let res = [];
		for ( let i = 0; i < 7; ++i )
			if ( array[ i ] )
				res.push( i );
		return res;
	}
	
}
