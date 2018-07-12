import React from 'react';
import { Text, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import Storage from '../../extend/storage';

import Item from './item';

import { color, style } from '../../styles';

export default class AlarmItem extends Item {
	
	state = {
		type:   undefined,
		label:  '',
		time:   '',
		repeat: [],
		active: false
	};
	
	public static create( key, label, time, repeat ): Promise<AlarmItem> {
		let data = { type: 'Alarm', label, time, repeat, active: false };
		return super._create<AlarmItem>( key, data, AlarmItem );
	}
	
	public async save(): Promise<void> {
		// TODO: turn on notifications
		if ( this.state.active === true ) {
			// push to larger alarm tracker
			
			const isRepeat = () => {
				for ( let r of this.state.repeat )
					if ( r )
						return true;
				return false;
			};
			if ( !isRepeat() ) {
				// push to different larger alarm tracker
			}
		}
		await Storage.mergeItem( this.key,
			{
				label:  this.state.label,
				time:   this.state.time,
				repeat: this.state.repeat,
				active: this.state.active
			} );
	}
	
	render(): JSX.Element {
		if ( !this.state.type )
			return null;
		
		return <ListItem
			containerStyle={[ color.listItem ]}
			topDivider
			bottomDivider
			title={this.state.label}
			titleStyle={[ color.foreground, { fontSize: 36 } ]}
			subtitle={this.subtitle()}
			onPress={this.onPress}
			switch={{
				value:         this.state.active,
				onValueChange: ( active ) => {
					this.setState( { active }, () => {
						this.save().then( () =>
							this.props.list.state.group.reloadActive(
								this.props.list.props.navigation.getParam( 'parent', null )
							).then()
						);
					} );
				}
			}}
		/>
	}
	
	subtitle = () => {
		// noinspection SpellCheckingInspection
		const days = 'SMTWTFS';
		let repeat = [];
		for ( let i = 0; i < 7; ++i ) {
			repeat[ i ] = <Text key={i} style={[
				this.state.repeat[ i ] ? color.highlight : color.foreground
			]}> {days[ i ]}</Text>;
		}
		
		return <View style={[ style.flex, style.row, style.space ]}>
			<Text style={[ color.foreground, {
				fontSize: 16
			} ]}>{AlarmItem.convert.timeTo12Hour( this.state.time )}</Text>
			<Text style={{ fontSize: 16 }}>{repeat}</Text>
		</View>;
	};
	
	public static convert = {
		dateToTime( date: Date ): string {
			return `${date.getHours()}:${( `0${date.getMinutes()}` ).slice( -2 )}`;
		},
		timeTo12Hour( time: string ): string {
			let parts = time.split( ':' );
			let hour = parseInt( parts[ 0 ] );
			return `${( hour + 11 ) % 12 + 1}:${parts[ 1 ]} ${( hour >= 12 ? 'PM' : 'AM' )}`;
		},
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
