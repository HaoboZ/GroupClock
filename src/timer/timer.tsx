import React from 'react';
import { Text, View } from 'react-native';
import createNavigator from '../components/createNavigator';
import NavComponent from '../components/navComponent';
import { IconButton } from '../components/nativeIcon';

import { color, style } from '../styles';

class Timer extends NavComponent {
	
	static navigationOptions( { navigation } ) {
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
	
	render() {
		return <View style={[
			style.flex,
			style.center,
			color.background
		]}>
			<Text style={[ color.foreground ]}>
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
