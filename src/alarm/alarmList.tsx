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

class AlarmList extends NavComponent {
	
	state = {
		group: null,
		list:  []
	};
	
	static navigationOptions( { navigation } ) {
		const group  = navigation.getParam( 'group' ),
				reload = navigation.getParam( 'reload' );
		if ( !group )
			return null;
		
		return {
			title:       group.state.label,
			headerTitle: <ListTitle onPress={() => {
				navigation.push( 'EditGroup', { group, reload } );
			}}>{group.state.label}</ListTitle>,
			headerRight:
							 <IconButton
								 name='add'
								 onPress={() => {
									 navigation.navigate( 'AddItem',
										 { group, reload } )
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
	}
	
	public async getData() {
		const key = this.props.navigation.getParam( 'key', 'AlarmMain' );
		let group = new GroupItem( { k: key } );
		
		// first time to load group
		let needNew = false;
		await group.load( true, group => {
			if ( !group )
				needNew = true;
		} );
		if ( needNew )
			group = await (
				await GroupItem.create( key, 'Alarm', moment.tz.guess(), [] )
			).load( true );
		
		// save to state
		this.setState( { group } );
		Promise.all( group.state.items.map( async key => {
			return await load( key );
		} ) ).then( list => this.setState( { list } ) );
		this.props.navigation.setParams( {
			group,
			reload: this.getData.bind( this )
		} );
	}
	
	render() {
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
