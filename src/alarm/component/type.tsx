import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ButtonGroup } from 'react-native-elements';

import styles from './styles';
import { themeStyle, contentStyle } from '../../styles';

export default class Type extends React.PureComponent {
	
	props: {
		type: number,
		change: ( string ) => void
	};
	
	render(): JSX.Element {
		return <View style={[ styles.Item, contentStyle.center ]}>
			<ButtonGroup
				buttons={[ 'Alarm', 'Group' ]}
				selectedIndex={this.props.type}
				onPress={this.props.change}
				containerStyle={[ themeStyle.background, styles.innerItem ]}
				textStyle={[ themeStyle.foreground, style.text ]}
				selectedButtonStyle={[ style.selectButton ]}
				selectedTextStyle={[ style.selectText ]}
			/>
		</View>;
	}
	
}

const style = StyleSheet.create( {
	text:         { fontSize: 14 },
	selectButton: { backgroundColor: '#ffffff' },
	selectText:   { color: '#000000' }
} );
