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
	
	static tz: string;
	
	static navigationOptions( { navigation } ) {
		const title = navigation.getParam( 'title', 'Alarm' ),
				key   = navigation.getParam( 'key', 'AlarmMain' );
		
		return {
			title,
			headerRight:
				<IconButton
					name='add'
					onPress={() => {
						navigation.navigate( 'addAlarm',
							{ tz: Alarm.tz, key } )
					}}
					size={40}
				/>
		};
	}
	
	componentDidMount() {
		this.getData();
	}
	
	private async getData() {
		const key = this.props.navigation.getParam( 'key', 'AlarmMain' );
		let data = await Storage.getItem( key );
		if ( data == undefined ) {
			alert( 'An error has occurred' );
			return;
		}
		
		if ( !data ) {
			// First instance of app
			data = { label: 'Alarm', tz: moment.tz.guess(), alarms: [] };
			await Storage.setItem( key, data );
		}
		this.props.navigation.setParams( { title: data.label } );
		Alarm.tz = data.tz;
		this.setState( { label: data.label, tz: data.tz } );
		this.setData( data.alarms );
	}
	
	private async setData( data ) {
		let result = data.map( key => {
			Storage.getItem( key ).then( ( res ) => {
				return res;
			} );
		} );
		this.setState( { data: result } );
	}
	
	render() {
		console.log( this.state );
		return <SwipeList
			style={[ color.background ]}
			data={[]}
			renderItem={this.renderItem}
			rightButtons={[ {
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
			} ]}
		/>;
	}
	
	private
	renderItem = ( item ) => {
		//TODO: Render each alarm
		return <View
			style={{
				borderColor:       colors.navigation,
				borderBottomWidth: 1,
				height:            50
			}}
		>
			<Text style={[ color.foreground ]}>
				I am {item.text} in a SwipeListView
			</Text>
		</View>
	};
	
}

export default createNavigator(
	{
		Alarm,
		addAlarm
	}
);
