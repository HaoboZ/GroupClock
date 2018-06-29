import React from 'react';
import { StatusBar, View } from 'react-native';

import MainNav from './navigator';

import { style } from './styles';

export default class Main extends React.PureComponent {
	
	render() {
		return <View style={[ style.flex ]}>
			{/*Makes status bar white*/}
			<StatusBar barStyle='light-content'/>
			<MainNav/>
		</View>;
	}
	
}
