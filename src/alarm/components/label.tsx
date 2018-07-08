import React from 'react';
import { color } from '../../styles';
import { Input, ListItem } from 'react-native-elements';
import styles from './styles';

export default class Label extends React.PureComponent {
	
	props: {
		label: string,
		change: ( string ) => void
	};
	
	render() {
		return <ListItem
			containerStyle={[ styles.Item ]}
			title='Label'
			titleStyle={[ color.foreground ]}
			rightElement={<Input
				containerStyle={[ color.background, styles.innerItem ]}
				inputStyle={[ color.foreground ]}
				onChangeText={this.props.change}
				value={this.props.label}
				maxLength={10}
			/>}
		/>;
	}
	
}

