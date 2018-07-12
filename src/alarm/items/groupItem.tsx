import React from 'react';
import { Group } from 'react-native';
import { ListItem } from 'react-native-elements';
import Storage from '../../extend/storage';

import { AlarmList } from '../alarmList';
import { load } from './item';
import AlarmItem from './alarmItem';

import { color } from '../../styles';

export const SwitchState = {
	off:     0,
	on:      1,
	partial: 2
};

export default class GroupItem extends React.PureComponent {
	
	props: {
		k: string,
		list?: AlarmList,
		onPress?: ( GroupItem ) => void
	};
	
	state = {
		type:   '',
		label:  '',
		tz:     '',
		items:  [],
		active: 0
	};
	
	key: string;
	mounted = false;
	
	constructor( props ) {
		super( props );
		this.key = props.k;
	}
	
	componentDidMount() {
		this.mounted = true;
		this.load().then();
	}
	
	componentWillUnmount() {
		this.mounted = false;
	}
	
	public static async create( key: string, label: string, tz: string, items: Array<boolean> ): Promise<GroupItem> {
		if ( !key )
			key = Math.random().toString( 36 ).substring( 2, 12 );
		let data = { type: 'Group', label, tz, items, active: SwitchState.off };
		await Storage.setItem( key, data );
		return new GroupItem( { k: key } );
	}
	
	public async load( callback?: ( GroupItem ) => void ) {
		await Storage.getItem( this.key ).then( data => {
			if ( data ) {
				if ( this.mounted )
					this.setState( data, () => {
						if ( callback )
							callback( this );
					} );
				else
					this.state = data;
			} else if ( callback )
				callback( null );
		} );
		return this;
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
			let item = await load( _item, true ) as AlarmItem | GroupItem;
			if ( !item )
				continue;
			await item.delete();
		}
		await Storage.removeItem( this.key );
	}
	
	public async getActive(): Promise<number> {
		let state = SwitchState.off,
			 first = true;
		for ( let _item of this.state.items ) {
			let item = await load( _item, true ) as AlarmItem | GroupItem;
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
	
	public async reloadActive( parent: AlarmList ) {
		let active = await this.getActive();
		if ( this.state.active !== active ) {
			this.state.active = active;
			await this.save();
			if ( parent )
				parent.setState( { dirty: true } );
		}
	}
	
	render() {
		if ( !this.state.type.length )
			return null;
		
		// TODO: pull down reload
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
					this.setState( { active: active ? 1 : 0 }, () => {
						// TODO: loop every child to turn on, recursive if group, ignore groups that are on
						this.save().then( async () => {
							this.props.list.state.group.reloadActive(
								this.props.list.props.navigation.getParam( 'parent', null )
							).then()
						} );
					} );
				},
				onTintColor:   this.state.active === SwitchState.partial ? '#007fff' : undefined
			}}
		/>
	}
	
	onPress = () => this.props.onPress( this )
	
}