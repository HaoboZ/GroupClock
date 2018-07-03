import React from 'react';
import { Text, View } from 'react-native';
import createNavigator from '../components/createNavigator';
import NavComponent from '../components/navComponent';
import { IconButton } from '../components/nativeIcon';
import SwipeList from '../components/swipeList';
import moment from 'moment-timezone';
import addAlarm from './addAlarm';
import Storage from '../extend/storage';

import { colors } from '../config';
import { color } from '../styles';

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
		const title  = navigation.getParam( 'title', 'Alarm' ),
				tz     = navigation.getParam( 'tz' ),
				key    = navigation.getParam( 'key', 'AlarmMain' ),
				reload = navigation.getParam( 'reload' );
		
		return {
			title,
			headerRight:
				<IconButton
					name='add'
					onPress={() => {
						navigation.navigate( 'addAlarm',
							{ tz, key, reload } )
					}}
					size={40}
				/>
		};
	}
	
	componentDidMount() {
		this.getData().then();
		this.props.navigation.setParams( { reload: this.getData.bind( this ) } );
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
		this.props.navigation.setParams( { title: data.label, tz: data.tz } );
		
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
		renderItem:   ( item ) => {
			//TODO: Render each alarm
			return <View
				style={{
					borderColor:       colors.navigation,
					borderBottomWidth: 1,
					height:            50
				}}
			>
				<Text style={[ color.foreground ]}>
					{item.type ? 'Group' : 'Alarm'}
				</Text>
			</View>
		},
		rightButtons: ( item ) => {
			if ( item.type == 1 ) {
				return [ {
					text: 'Pop', color: 'blue', onPress: () => {
						this.props.navigation.pop();
					}
				}, {
					text: 'Push', color: 'red', onPress: () => {
						this.props.navigation.push( 'Alarm', {
							title: 'Next Alarm',
							tz:    this.state.tz
						} );
					}
				} ];
			} else {
				return [ {
					text: 'Edit', color: 'red', onPress: () => {
					
					}
				} ]
			}
		}
	}
	
}

export default createNavigator(
	{
		Alarm,
		addAlarm
	}
);
