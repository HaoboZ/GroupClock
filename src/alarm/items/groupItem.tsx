import React from 'react';
import { Group } from 'react-native';
import { ListItem } from 'react-native-elements';
import Storage from '../../extend/storage';

import AlarmList from '../alarmList';
import Item from './item';

import { color } from '../../styles';
import AlarmItem from "./alarmItem";

export const SwitchState = {
	off:     0,
	on:      1,
	partial: 2
};

export default class GroupItem extends Item {
	
	state: {
		type: string,
		parent: string,
		label: string,
		tz: string,
		items: Array<string>,
		active: number
	} = {
		type:   undefined,
		parent: undefined,
		label:  undefined,
		tz:     undefined,
		items:  undefined,
		active: undefined
	};
	
	public static async create( key: string, parent: string, label: string, tz: string, items: Array<string> ): Promise<GroupItem> {
		let data = { type: 'Group', parent, label, tz, items, active: SwitchState.off };
		return super._create<GroupItem>( key, data, GroupItem );
	}
	
	public async save(): Promise<void> {
		await Storage.mergeItem( this.key,
			{
				label:  this.state.label,
				tz:     this.state.tz,
				items:  this.state.items,
				active: this.state.active
			} );
	}
	
	public async delete(): Promise<void> {
		for ( let _item of this.state.items ) {
			let item = await GroupItem.getNew( _item, true ) as Item;
			if ( !item )
				continue;
			await item.delete();
		}
		await super.delete();
	}
	
	public async getActive(): Promise<number> {
		let state = SwitchState.off,
			 first = true;
		for ( let _item of this.state.items ) {
			let item = await GroupItem.getNew( _item, true ) as Item;
			if ( !item )
				continue;
			await item.load();
			
			// first state initialize
			if ( first ) {
				state = item.state.active === true || item.state.active === SwitchState.on ? 1 : 0;
				first = false;
				continue;
			}
			// child states are different
			if ( state !== ( item.state.active === true || item.state.active === SwitchState.on ? 1 : 0 ) )
				return SwitchState.partial;
		}
		return state;
	}
	
	public async reloadActive( parent: AlarmList ): Promise<void> {
		let active = await this.getActive();
		if ( this.state.active !== active ) {
			this.state.active = active;
			await this.save();
			if ( parent )
				parent.setState( { dirty: true } );
		}
	}
	
	public async activate( active: boolean ): Promise<void> {
		for ( let _item of this.state.items ) {
			let item = await GroupItem.getNew( _item, true ) as Item;
			if ( !item )
				continue;
			await item.load();
			item.activate( active ).then();
		}
		await super.activate( active ? 1 : 0 );
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
			subtitle={this.state.tz}
			subtitleStyle={[ color.foreground ]}
			onPress={this.onPress}
			switch={{
				value:         this.state.active !== SwitchState.off,
				onValueChange: ( active ) => {
					this.setState( { active: active ? 1 : 0 }, async () => {
						await this.activate( active );
						await this.props.list.state.group.reloadActive(
							this.props.list.props.navigation.getParam( 'parent', null )
						);
					} );
				},
				onTintColor:   this.state.active === SwitchState.partial ? '#007fff' : undefined
			}}
		/>
	}
	
	static async getNew( key, obj = false, alarmProps = {}, groupProps = {} ): Promise<Item | JSX.Element> {
		return await Storage.getItem( key ).then( async data => {
			if ( !data )
				return undefined;
			
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
	
}