import React from 'react';
import { FlatList, ListRenderItemInfo, Text } from 'react-native';
import * as moment from 'moment-timezone';

import createNavigator from '../extend/createNavigator';
import NavComponent from '../extend/navComponent';
import { IconButton } from '../extend/nativeIcon';

import ListTitle from './components/listTitle';
import AddItem from './modify/addItem';
import EditGroup from './modify/editGroup';
import EditAlarm from './modify/editAlarm';
import { load } from './items/item';
import GroupItem from './items/groupItem';

import { color, style } from '../styles';

export class AlarmList extends NavComponent {
	
	state = {
		group: null,
		dirty: false,
		list:  []
	};
	
	static navigationOptions( { navigation } ) {
		const group = navigation.getParam( 'group' );
		const current = navigation.getParam( 'current' );
		if ( !group )
			return null;
		
		
		return {
			title:       group.state.label,
			headerTitle: <ListTitle onPress={() => {
				
				return navigation.navigate(
					'EditGroup',
					{ parent: current }
				);
			}}>{group.state.label}</ListTitle>,
			headerRight:
							 <IconButton
								 name='add'
								 onPress={() => {
									 navigation.navigate(
										 'AddItem',
										 { parent: current }
									 )
								 }}
								 size={40}
							 />
		};
	}
	
	/**
	 * Load data from storage.
	 */
	componentDidMount() {
		this.getData().then();
		this.props.navigation.setParams( { current: this } );
	}
	
	public async getData() {
		let group: GroupItem = this.props.navigation.getParam( 'group', null );
		
		group = new GroupItem( { k: group ? group.key : 'AlarmMain' } );
		let needNew = false;
		await group.load( true, group => {
			if ( !group )
				needNew = true;
		} );
		if ( needNew ) {
			if ( group.key !== 'AlarmMain' )
				return;
			group = await (
				await GroupItem.create( 'AlarmMain', 'Alarm', moment.tz.guess(), [] )
			).load( true );
		}
		
		// save to state
		this.setState( { group } );
		let canClick = true;
		Promise.all( group.state.items.map( async key => {
			return await load( key, false, {
				list:    this,
				onPress: alarm => this.props.navigation.navigate( 'EditAlarm',
					{ alarm, parent: this } )
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
		} ) ).then( list => this.setState( { list } ) );
		this.props.navigation.setParams( { group } );
	}
	
	// TODO: add text if there is no item in list
	// TODO: allow moving items by dragging an icon on left side
	// TODO: allow extracting items to parent group before deleting
	// TODO: allow dragging items into another group to place in
	render() {
		if ( this.state.dirty ) {
			this.state.dirty = false;
			this.getData().then();
			return null;
		}
		
		if ( !this.state.group )
			return null;
		
		return <FlatList
			style={[ color.background ]}
			data={[ <Text style={[ style.centerSelf, color.foreground ]}>{this.state.group.state.tz}</Text>,
					  ...this.state.list ]}
			renderItem={this.list.renderItem}
			keyExtractor={this.list.keyExtractor}
		/>;
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
