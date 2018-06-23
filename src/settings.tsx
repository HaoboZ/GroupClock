import React from 'react';
import { Text, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { createStackNavigator, NavigationInjectedProps, NavigationScreenOptions } from 'react-navigation';

import config from './config';

class Settings extends React.PureComponent {
	
	props: NavigationInjectedProps;
	
	static navigationOptions( { navigation }: NavigationInjectedProps ): NavigationScreenOptions {
		return {
			title: 'Settings'
		};
	}
	
	render() {
		return <View style={[
			config.styles.flex,
			config.styles.center,
			{ backgroundColor: config.colors.background }
		]}>
			<Text style={[ { color: config.colors.text } ]}>
				Settings
			</Text>
		</View>;
	}
	
}

export default createStackNavigator(
	{
		Settings: Settings
	},
	{
		initialRouteName:  'Settings',
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