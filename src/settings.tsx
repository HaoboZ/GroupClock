import React from 'react';
import { Text, View } from 'react-native';
import createNavigator from './extend/createNavigator';
import NavComponent, { Options } from './extend/navComponent';

import { themeStyle, contentStyle } from './styles';

class Settings extends NavComponent {
	
	static navigationOptions( { navigation } ): Options {
		
		return {
			title: 'Settings'
		};
	}
	
	render(): JSX.Element {
		return <View style={[
			contentStyle.flex,
			contentStyle.center,
			themeStyle.background
		]}>
			<Text style={[ themeStyle.foreground ]}>
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
