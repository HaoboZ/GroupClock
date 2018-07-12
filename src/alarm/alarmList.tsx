import React from 'react';
import { FlatList, ListRenderItemInfo, Text, View } from 'react-native';
import * as moment from 'moment-timezone';

import createNavigator from '../extend/createNavigator';
import NavComponent, { Options } from '../extend/navComponent';
import { IconButton } from '../extend/nativeIcon';

import ListTitle from './components/listTitle';
import AddItem from './modify/addItem';
import EditGroup from './modify/editGroup';
import EditAlarm from './modify/editAlarm';
import { load } from './items/item';
import GroupItem from './items/groupItem';

import { color, style } from '../styles';

export class AlarmList extends NavComponent {
	
	state: { group: GroupItem, dirty: boolean, list: Array<JSX.Element> } = {
		group: null,
		dirty: false,
		list:  []
	};
	
	static navigationOptions( { navigation } ): Options {
		const group = navigation.getParam( 'group' );
		const current = navigation.getParam( 'current' );
		if ( !group )
			return null;
		
		
		return {
			title:       group.state.label,
			headerTitle: <ListTitle onPress={() => {
				
				return navigation.navigate(
					'EditGroup',
					{ list: current }
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
	
	mounted = false;
	
	componentDidMount(): void {
		this.mounted = true;
		// load data from storage
		this.getData().then();
		this.props.navigation.setParams( { current: this } );
	}
	
	componentWillUnmount(): void {
		this.mounted = false;
	}
	
	public async getData(): Promise<void> {
		let group: GroupItem = this.props.navigation.getParam( 'group', null );
		
		group = new GroupItem( { k: group ? group.key : 'AlarmMain' } );
		let needNew = false;
		await group.load( group => {
			if ( !group )
				needNew = true;
		} );
		if ( needNew ) {
			if ( group.key !== 'AlarmMain' )
				return;
			group = await (
				await GroupItem.create( 'AlarmMain', 'Alarm', moment.tz.guess(), [] )
			).load();
		}
		
		// save to state
		let canClick = true;
		Promise.all( group.state.items.map( async key => {
			return await load( key, false, {
				list:    this,
				onPress: alarm => this.props.navigation.navigate( 'EditAlarm',
					{ alarm, list: this } )
			}, {
				list:    this,
				onPress: group => {
					if ( canClick ) {
						canClick = false;
						this.props.navigation.push( 'AlarmList',
							{ group, parent: this } );
					}
					setTimeout( () => canClick = true, 500 );
				}
			} );
		} ) ).then( list => this.setState( { group, list } ) );
		this.props.navigation.setParams( { group } );
	}
	
	// TODO: add text if there is no item in list
	// TODO: allow moving items by dragging an icon on left side
	// TODO: allow extracting items to parent group before deleting
	// TODO: allow dragging items into another group to place in
	render(): JSX.Element {
		const group = this.state.group;
		if ( !group )
			return null;
		
		if ( this.state.dirty ) {
			this.state.dirty = false;
			group.reloadActive( this.props.navigation.getParam( 'parent', null ) )
				.then( async () => await this.getData() );
			return null;
		}
		
		return <View style={[ color.background, style.flex ]}>
			<Text style={[ style.centerSelf, color.foreground ]}>{group.state.tz}</Text>
			<FlatList
				data={this.state.list}
				renderItem={this.list.renderItem}
				keyExtractor={this.list.keyExtractor}
			/>
		</View>;
	}
	
	private list = {
		renderItem:   ( { item }: ListRenderItemInfo<JSX.Element> ) => item,
		keyExtractor: ( item, index ) => index.toString()
	};
	
}

export default createNavigator(
	{
		AlarmList,
		AddItem,
		EditGroup,
		EditAlarm
	}
);
