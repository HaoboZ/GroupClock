import React from 'react';
import { FlatList, ListRenderItemInfo } from 'react-native';
import * as moment from 'moment-timezone';

import createNavigator from '../components/createNavigator';
import NavComponent from '../components/navComponent';
import { IconButton } from '../components/nativeIcon';
import AddItem from './addItem';
import GroupItem from './items/groupItem';
import load from './items/item';

import { color } from '../styles';

class AlarmList extends NavComponent {
	
	state = {
		group: null,
		list:  []
	};
	
	static navigationOptions( { navigation } ) {
		const title = navigation.getParam( 'title' );
		// TODO: make title a component and add clickable icon to the left
		return {
			title,
			headerRight:
				<IconButton
					name='add'
					onPress={() => {
						const tz     = navigation.getParam( 'tz' ),
								key    = navigation.getParam( 'key', 'AlarmMain' ),
								reload = navigation.getParam( 'reload' );
						navigation.navigate( 'AddItem',
							{ tz, key, reload } )
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
		await group.load( true, ( g ) => {
			if ( !g )
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
			title:  group.state.label,
			tz:     group.state.tz,
			reload: this.getData.bind( this )
		} );
	}
	
	render() {
		return <FlatList
			style={[ color.background ]}
			data={this.state.list}
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
		AddItem
	}
);
