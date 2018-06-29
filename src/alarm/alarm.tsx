import React from 'react';
import { Text, View } from 'react-native';
import createNavigator from '../components/createNavigator';
import NavComponent from '../components/navComponent';
import { IconButton } from '../components/nativeIcon';
import SwipeList from '../components/swipeList';
import moment from 'moment-timezone';

import addAlarm from './addAlarm';

import { colors } from '../config';
import { color } from '../styles';

class Alarm extends NavComponent {
	
	state = {
		data: []
	};
	
	static navigationOptions( { navigation } ) {
		const title = navigation.getParam( 'title', 'Alarm' ),
				tz    = navigation.getParam( 'tz', moment.tz.guess() );
		
		return {
			title,
			headerRight:
				<IconButton
					name='add'
					onPress={() => navigation.navigate( 'addAlarm', { tz } )}
					size={40}
				/>
		};
	}
	
	componentDidMount() {
		//TODO: Load data from asyncStorage to state.data
		this.setState( { data: Array( 3 ).fill( '' ).map( ( _, i ) => ( { text: `item #${i}` } ) ) } );
	}
	
	render() {
		return <SwipeList
			style={[ color.background ]}
			data={this.state.data}
			renderItem={this.renderItem}
			rightButtons={[ {
				text: 'Pop', color: 'blue', onPress: () => {
					this.props.navigation.pop();
				}
			}, {
				text: 'Push', color: 'red', onPress: () => {
					this.props.navigation.push( 'Alarm', {
						title: 'Next Alarm',
						tz:    this.props.navigation.getParam( 'tz' )
					} );
				}
			} ]}
		/>;
	}
	
	private renderItem = ( item ) => {
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
