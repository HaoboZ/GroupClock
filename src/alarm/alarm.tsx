import React from 'react';
import { ListRenderItemInfo, Text, View } from 'react-native';
import createNavigator from '../components/createNavigator';
import NavComponent from '../components/navComponent';
import { IconButton } from '../components/nativeIcon';
import SwipeList from '../components/swipeList';
import moment from 'moment-timezone';
import AddItem from './addItem';
import Storage from '../extend/storage';

import { colors } from '../config';
import { color } from '../styles';

export type AlarmData = {
	label: string,
	type: number,
	tz?: string,
	time?: string,
	repeat?: Array<string>,
	alarms?: Array<string>
};

export const itemType = {
	Alarm: 0,
	Group: 1
};

class Alarm extends NavComponent {
	
	state = {
		label: '',
		tz:    '',
		data:  []
	};
	
	constructor( props ) {
		super( props );
	}
	
	static navigationOptions( { navigation } ) {
		const title = navigation.getParam( 'title' );
		
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
	
	componentDidMount() {
		this.getData().then( () => {
			this.props.navigation.setParams( {
				title:  this.state.label,
				tz:     this.state.tz,
				reload: this.getData.bind( this )
			} );
		} );
	}
	
	public async getData() {
		const key = this.props.navigation.getParam( 'key', 'AlarmMain' );
		let data = await Storage.getItem( key );
		if ( data === undefined ) {
			alert( 'An error has occurred' );
			return;
		}
		
		if ( !data ) {
			// First instance of app
			data = { label: 'Alarm', tz: moment.tz.guess(), alarms: [] };
			await Storage.setItem( key, data );
		}
		
		this.setState( { label: data.label, tz: data.tz } );
		Promise.all( data.alarms.map( async key => {
			return await Storage.getItem( key );
		} ) ).then( data => this.setState( { data } ) );
	}
	
	render() {
		return <SwipeList
			style={[ color.background ]}
			data={this.state.data}
			renderItem={this.list.renderItem}
			rightButtons={this.list.rightButtons}
		/>;
	}
	
	private list = {
		renderItem:   ( { item }: ListRenderItemInfo<AlarmData> ): React.ReactElement<any> => {
			if ( item.type === itemType.Alarm ) {
				return <View
					style={{
						borderColor:       colors.navigation,
						borderBottomWidth: 1,
						height:            64
					}}
				>
					<Text style={[ color.foreground ]}>
						Alarm: {item.label}, {item.time}, {item.repeat.toString()}
					</Text>
				</View>
			} else {
				return <View
					style={{
						borderColor:       colors.navigation,
						borderBottomWidth: 1,
						height:            64
					}}
				>
					<Text style={[ color.foreground ]}>
						Group: {item.label}, {item.tz}
					</Text>
				</View>
			}
		},
		rightButtons: ( { item, index }: ListRenderItemInfo<AlarmData> ) => {
			if ( item.type === itemType.Alarm ) {
				return [ {
					text: 'Delete', color: '#ff0000', onPress: () => {
						this.removeItem( index );
					}
				}, {
					text: 'Edit', color: '#0000ff', onPress: () => {
						alert( 'not implemented' );
					}
				} ];
			} else {
				return [ {
					text: 'Delete', color: '#ff0000', onPress: () => {
						this.removeItem( index );
					}
				}, {
					text: 'Edit', color: '#0000ff', onPress: () => {
						alert( 'not implemented' );
					}
				} ];
			}
		}
	};
	
	private removeItem( index: number ) {
	
	}
	
}

export default createNavigator(
	{
		Alarm,
		AddItem
	}
);
