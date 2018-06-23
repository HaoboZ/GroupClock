import React from 'react';
import { Button, Text, View } from 'react-native';
import { NavigationInjectedProps, NavigationScreenOptions } from 'react-navigation';

import config from '../config';

export default class extends React.PureComponent {
	
	props: NavigationInjectedProps;
	
	static navigationOptions( { navigation }: NavigationInjectedProps ): NavigationScreenOptions {
		return {
			title:           'Add Alarm',
			headerBackTitle: 'Cancel',
			headerRight:     <Button
									  title='Save'
									  onPress={() => navigation.goBack()}
									  color={config.colors.highlight}
								  />
		};
	}
	
	render() {
		//TODO: add time selector, name changer
		return <View style={[
			config.styles.flex,
			config.styles.center,
			{ backgroundColor: config.colors.background }
		]}>
			<Text style={[ { color: config.colors.text } ]}>
				Add Alarm
			</Text>
		</View>;
	}
	
}