import React from 'react';
import { Text, View } from 'react-native';
import createNavigator from '../extend/createNavigator';
import NavComponent, { Options } from '../extend/navComponent';
import { IconButton } from '../extend/nativeIcon';

import { themeStyle, contentStyle } from '../styles';

class Timer extends NavComponent {
	
	static navigationOptions( { navigation } ): Options {
		const title = navigation.getParam( 'title', 'Timer' );
		
		return {
			title,
			headerRight:
				<IconButton
					name='add'
					onPress={() => navigation.navigate( 'addTimer' )}
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
				Timer
			</Text>
		</View>;
	}
	
}

export default createNavigator(
	{
		Timer
	}
);
