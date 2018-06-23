import React from 'react';
import { Text, View } from 'react-native';
import { SwipeListView } from 'react-native-swipe-list-view';
import { createStackNavigator, NavigationInjectedProps, NavigationScreenOptions } from 'react-navigation';

import { IconButton } from '../components/nativeIcon';

import config from '../config';

class Timer extends React.PureComponent {
	
	props: NavigationInjectedProps;
	
	static navigationOptions( { navigation }: NavigationInjectedProps ): NavigationScreenOptions {
		return {
			title:       'Timer',
			headerRight: <IconButton
								 name='add'
								 onPress={() => navigation.navigate( 'addTimer' )}
								 size={40}
								 color={config.colors.highlight}
							 />
		};
	}
	
	render() {
		return <View style={[
			config.styles.flex,
			config.styles.center,
			{ backgroundColor: config.colors.background }
		]}>
			<Text style={[ { color: config.colors.text } ]}>
				Timer
			</Text>
		</View>;
	}
	
}

export default createStackNavigator(
	{
		Timer: Timer
	},
	{
		initialRouteName:  'Timer',
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