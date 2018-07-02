import React from 'react';
import { View } from 'react-native';
import { ButtonGroup } from 'react-native-elements';

import styles from './styles';
import { color, style } from '../../styles';

export default class Type extends React.PureComponent {
	
	props: {
		type: number,
		change: ( string ) => void
	};
	
	render() {
		return <View style={[ styles.Item, style.center ]}>
			<ButtonGroup
				buttons={[ 'Alarm', 'Group' ]}
				selectedIndex={this.props.type}
				onPress={this.props.change}
				containerStyle={[ color.background, styles.innerItem ]}
				selectedButtonStyle={{ backgroundColor: '#ffffff' }}
				selectedTextStyle={{ color: '#000000' }}
				textStyle={[ color.foreground, { fontSize: 14 } ]}
			/>
		</View>;
	}
	
}

