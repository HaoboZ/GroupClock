import React from 'react';
import { Text, View } from 'react-native';
import createNavigator from './extend/createNavigator';
import NavComponent, { Options } from './extend/navComponent';

import { color, style } from './styles';

class Settings extends NavComponent {
	
	static navigationOptions( { navigation } ): Options {
		
		return {
			title: 'Settings'
		};
	}
	
	render(): JSX.Element {
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
