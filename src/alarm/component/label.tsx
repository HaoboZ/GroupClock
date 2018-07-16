import React from 'react';
import { Input, ListItem } from 'react-native-elements';

import { color } from '../../styles';
import styles from './styles';

export default class Label extends React.PureComponent {
	
	props: {
		label: string,
		change: ( string ) => void
	};
	
	render(): JSX.Element {
		return <ListItem
			containerStyle={[ styles.Item ]}
			title='Label'
			titleStyle={[ color.foreground ]}
			rightElement={<Input
				keyboardAppearance='dark'
				containerStyle={[ color.background, styles.innerItem ]}
				inputStyle={[ color.foreground ]}
				onChangeText={this.props.change}
				value={this.props.label}
				selectTextOnFocus
				maxLength={10}
			/>}
		/>;
	}
	
}

