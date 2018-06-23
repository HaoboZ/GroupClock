import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { createStackNavigator, NavigationInjectedProps, NavigationScreenOptions } from 'react-navigation';

import { IconButton } from '../components/nativeIcon';

import config from '../config';

class Stopwatch extends React.PureComponent {
	
	props: NavigationInjectedProps;
	
	static navigationOptions( { navigation }: NavigationInjectedProps ): NavigationScreenOptions {
		return {
			title:       'Stopwatch',
			headerRight: <IconButton
								 name='add'
								 onPress={() => navigation.navigate( 'addStopwatch' )}
								 size={40}
								 color={config.colors.highlight}
							 />
		};
	}
	
	state = {
		timer:   null,
		counter: '00',
		ms:      '00',
	};
	
	componentWillUnmount() {
		clearInterval( this.state.timer );
	}
	
	start() {
		let timer = setInterval( () => {
			let num   = ( Number( this.state.ms ) + 1 ).toString(),
				 count = this.state.counter;
			
			if (Number( this.state.ms ) == 99) {
				count = ( Number( this.state.counter ) + 1 ).toString();
				num   = '00';
			}
			
			this.setState( {
									counter: count.length == 1 ? '0' + count : count,
									ms:      num.length == 1 ? '0' + num : num
								} );
		}, 0 );
		this.setState( { timer } );
	}
	
	render() {
		return <View style={[ config.styles.center ]}>
			<Text style={[ _styles.counter ]}>
				{this.state.counter}
			</Text>
			<Text style={[ _styles.miniCounter ]}>
				{this.state.ms}
			</Text>
			
			<Button title="Start" onPress={this.onButtonStart.bind( this )}/>
			<Button title="Stop" onPress={this.onButtonStop.bind( this )}/>
			<Button title="Clear" onPress={this.onButtonClear.bind( this )}/>
		</View>;
	}
	
	onButtonStart() {
		clearInterval( this.state.timer );
		this.start();
	}
	
	onButtonStop() {
		clearInterval( this.state.timer );
	}
	
	onButtonClear() {
		this.setState(
			{
				counter: '00',
				ms:      '00'
			}
		);
	}
	
}

const _styles = StyleSheet.create(
	{
		counter:     {
			fontSize:  60,
			textAlign: 'center',
			height:    60,
			margin:    10
		},
		miniCounter: {
			fontSize: 20,
			position: 'relative',
			top:      -32,
			right:    -50
		}
	}
);

export default createStackNavigator(
	{
		Stopwatch: Stopwatch
	},
	{
		initialRouteName:  'Stopwatch',
		navigationOptions: {
			headerStyle:      {
				backgroundColor: config.colors.background,
			},
			headerTitleStyle: {
				color: config.colors.text
			},
		}
	}
);