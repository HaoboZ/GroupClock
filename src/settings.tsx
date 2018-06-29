import React from 'react';
import { Text, View } from 'react-native';
import { NavigationInjectedProps, NavigationScreenOptions } from 'react-navigation';
import createNavigator from './components/createNavigator';
import NavComponent from './components/navComponent';

import { color, style } from './styles';

class Settings extends NavComponent {
	
	props: NavigationInjectedProps;
	
	static navigationOptions( { navigation }: NavigationInjectedProps ): NavigationScreenOptions {
		
		return {
			title: 'Settings'
		};
	}
	
	render() {
		return <View style={[
			style.flex,
			style.center,
			color.background
		]}>
			<Text style={[ color.foreground ]}>
				Settings
			</Text>
		</View>;
	}
	
}

export default createNavigator(
	{
		Settings
	}
);
