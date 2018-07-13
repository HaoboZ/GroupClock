import React from 'react';
import { Text, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import Storage from '../../extend/storage';
import moment, { Moment } from 'moment-timezone';

import { alarms, saveAlarms, saveSingleAlarms, singleAlarms } from '../alarm';
import Item from './item';
import GroupItem from './groupItem';

import { color, style } from '../../styles';

export default class AlarmItem extends Item {
	
	state: {
		type: string,
		parent: string,
		label: string,
		time: string,
		repeat: Array<boolean>,
		active: boolean,
		update: number
	} = {
		type:   undefined,
		parent: undefined,
		label:  undefined,
		time:   undefined,
		repeat: undefined,
		active: undefined,
		update: undefined
	};
	
	public static create( key: string, parent: string, label: string, time: string, repeat: Array<boolean> ): Promise<AlarmItem> {
		let data = { type: 'Alarm', parent, label, time, repeat, active: false, update: moment().unix() };
		return super._create<AlarmItem>( key, data, AlarmItem );
	}
	
	public async save(): Promise<void> {
		let parent = await GroupItem.getNew( this.state.parent, true ) as GroupItem;
		await parent.load();
		
		let time: Moment = moment().tz( parent.state.tz );
		
		// TODO: turn on notifications
		
		alarms[ this.key ] = this.state.active;
		saveAlarms().then();
		if ( this.state.active === true && !this.isRepeat() ) {
			let index = singleAlarms.indexOf( this.key );
			if ( index !== -1 )
				singleAlarms.splice( index, 1 );
			singleAlarms.push( this.key );
			saveSingleAlarms().then();
			
			let target = moment.tz( this.state.time, parent.state.tz )
				.subtract( 1, 'day' );
			while ( target.isBefore( time ) ) {
				target.add( 1, 'day' );
			}
			time = target;
		}
		
		await Storage.mergeItem( this.key, {
			label:  this.state.label,
			time:   this.state.time,
			repeat: this.state.repeat,
			active: this.state.active,
			update: time.unix()
		} );
	}
	
	public async delete(): Promise<void> {
		delete alarms[ this.key ];
		saveAlarms().then();
		await super.delete();
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
			} ]}>{moment( this.state.time ).format( 'LT' )}</Text>
			<Text style={{ fontSize: 16 }}>{repeat}</Text>
		</View>;
	};
	
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
	
	private isRepeat() {
		for ( let r of this.state.repeat )
			if ( r )
				return true;
		return false;
	};
	
}
