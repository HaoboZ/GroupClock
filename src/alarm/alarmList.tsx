import React from 'react';
import { FlatList, ListRenderItemInfo, RefreshControl, Text, View } from 'react-native';
import moment from 'moment-timezone';

import NavComponent, { Options } from '../extend/navComponent';
import { IconButton } from '../extend/nativeIcon';
import { globals } from './alarm';
import ListTitle from './components/listTitle';
import EditGroup from './modify/editGroup';
import EditAlarm from './modify/editAlarm';

import Item from './items/item';
import AlarmItem from './items/alarmItem';
import GroupItem from './items/groupItem';
import AddItem, { itemType } from './modify/addItem';

import { color, style } from '../styles';
import { colors } from '../config';

export default class AlarmList extends NavComponent {
	
	state: {
		group: GroupItem,
		dirty: boolean,
		list: Array<JSX.Element>,
		refreshing: boolean
	} = {
		group:      null,
		dirty:      false,
		list:       [],
		refreshing: false
	};
	
	static navigationOptions( { navigation } ): Options {
		const group   = navigation.getParam( 'group' ),
				current = navigation.getParam( 'current' );
		if ( !group )
			return null;
		
		
		return {
			title:       group.state.label,
			headerTitle: <ListTitle onPress={() => {
				
				return navigation.navigate(
					'EditGroup',
					{ list: current, parent: navigation.getParam( 'parent', null ) }
				);
			}}>{group.state.label}</ListTitle>,
			headerRight:
							 <IconButton
								 name='add'
								 onPress={() => {
									 navigation.navigate(
										 'AddItem',
										 { list: current }
									 )
								 }}
								 size={40}
							 />
		};
	}
	
	static initial: Promise<void>;
	
	mounted = false;
	
	componentDidMount(): void {
		this.mounted = true;
		// load data from storage
		AlarmList.initial.then( async () => await this.getData() );
		this.props.navigation.setParams( { current: this } );
	}
	componentWillUnmount(): void {
		this.mounted = false;
	}
	
	/**
	 * Retrieves data from storage and updates element.
	 *
	 * @returns {Promise<void>}
	 */
	public async getData(): Promise<void> {
		let group: GroupItem = this.props.navigation.getParam( 'group', null );
		group = new GroupItem( { k: group ? group.key : 'AlarmMain' } );
		
		// checks if it needs to create a new starting group
		let needNew = false;
		await group.load( group => {
			if ( !group )
				needNew = true;
		} );
		if ( needNew ) {
			if ( group.key !== 'AlarmMain' )
				return;
			group = await (
				await GroupItem.create( 'AlarmMain', null, 'Alarm', moment.tz.guess(), [] )
			).load();
		}
		
		let canClick = true;
		// load each individual child and add to display list
		Promise.all( group.state.items.map( async key => {
			return await GroupItem.getNew( key, false, {
				list:    this,
				onPress: alarm => this.props.navigation.navigate( 'EditAlarm',
					{ alarm, list: this } )
			}, {
				list:    this,
				onPress: group => {
					if ( !canClick )
						return;
					canClick = false;
					
					this.props.navigation.push( 'AlarmList',
						{ group, parent: this } );
					
					setTimeout( () => canClick = true, 500 );
				}
			} );
		} ) ).then( list => {
			// currently a workaround, sometimes called when not mounted
			if ( !this.mounted )
				return;
			this.setState( { group, list } );
		} );
		this.props.navigation.setParams( { group } );
	}
	
	/**
	 * Creates a new item and adds it to parent.
	 *
	 * @param {any} state
	 * @returns {Promise<Item>}
	 */
	async addNew( state: any ): Promise<void> {
		let item: Item;
		
		if ( state.type === itemType.Alarm ) {
			item = await AlarmItem.create(
				null,
				this.state.group.key,
				state.alarmLabel,
				state.time.format( 'YYYY-MM-DD HH:mm' ),
				AlarmItem.convert.fillArray( state.repeat )
			);
		} else {
			item = await GroupItem.create(
				null,
				this.state.group.key,
				state.groupLabel,
				state.tz,
				[]
			);
		}
		
		// adds key to items
		this.state.group.state.items.push( item.key );
		await this.state.group.save();
		this.setState( { dirty: true } );
	}
	
	render(): JSX.Element {
		const group = this.state.group;
		if ( !group )
			return <View style={[ color.background, style.flex ]}/>;
		
		// allows externally to reload
		if ( this.state.dirty ) {
			this.state.dirty = false;
			// will check if active state has changed
			group.reloadActive( this.props.navigation.getParam( 'parent', null ) )
				.then( async () => await this.getData() );
			return <View style={[ color.background, style.flex ]}/>;
		}
		
		// TODO: add text if there is no item in list
		// TODO: allow moving items by dragging an icon on left side
		// TODO: allow extracting items to parent group before deleting
		// TODO: allow dragging items into another group to place in
		return <View style={[ color.background, style.flex ]}>
			<Text style={[ style.centerSelf, color.foreground ]}>{group.state.tz}</Text>
			<FlatList
				data={this.state.list}
				renderItem={this.list.renderItem}
				refreshControl={<RefreshControl
					refreshing={this.state.refreshing}
					onRefresh={this._onRefresh}
					tintColor={colors.foreground}
				/>}
				keyExtractor={this.list.keyExtractor}
			/>
		</View>;
	}
	
	_onRefresh = () => {
		this.setState( { refreshing: true } );
		globals.updateSingle().then( () => {
			setTimeout(
				() => this.setState( { refreshing: false, dirty: true } ),
				250
			);
		} );
	};
	
	private list = {
		renderItem:   ( { item }: ListRenderItemInfo<JSX.Element> ) => item,
		keyExtractor: ( item, index ) => index.toString()
	};
	
}
