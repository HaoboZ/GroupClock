import React from 'react';
import { Text, View } from 'react-native';
import createNavigator from '../extend/createNavigator';
import NavComponent, { Options } from '../extend/navComponent';
import { IconButton } from '../extend/nativeIcon';

import { themeStyle, contentStyle } from '../styles';

class Stopwatch extends NavComponent {
	
	static navigationOptions( { navigation } ): Options {
		const title = navigation.getParam( 'title', 'Stopwatch' );
		
		return {
			title,
			headerRight:
				<IconButton
					name='add'
					onPress={() => navigation.navigate( 'addStopwatch' )}
					size={40}
				/>
		};
	}
	
	render(): JSX.Element {
		return <View style={[
			contentStyle.flex,
			contentStyle.center,
			themeStyle.background
		]}>
			<Text style={[ themeStyle.foreground ]}>
				Stopwatch
			</Text>
		</View>;
	}
	
}

export default createNavigator(
	{
		Stopwatch
	}
);
