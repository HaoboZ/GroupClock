import React from 'react';
import { Text, View } from 'react-native';
import { IconButton } from '../../extend/nativeIcon';

import { color, style } from '../../styles';

export default class ListTitle extends React.PureComponent {
	
	props: {
		children,
		onPress
	};
	
	render(): JSX.Element {
		return <View style={[ style.flex, style.row, style.center ]}>
			<IconButton name='open' outline={true} onPress={this.props.onPress}/>
			<Text
				style={[ color.foreground, { fontWeight: 'bold', fontSize: 18 } ]}
			>{this.props.children}</Text>
		</View>
	}
	
}
