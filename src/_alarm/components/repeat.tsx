import React from 'react';
import { ButtonGroup, ListItem } from 'react-native-elements';

import styles from './styles';
import { colors } from '../../config';
import { color } from '../../styles';

export default class Repeat extends React.PureComponent {
	
	props: {
		repeat: Array<number>,
		change: ( Array ) => void
	};
	
	render(): JSX.Element {
		return <ListItem
			containerStyle={[ styles.Item, {
				paddingRight: 0
			} ]}
			title='Repeat'
			titleStyle={[ color.foreground ]}
			rightElement={<ButtonGroup
				buttons={[ 'Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa' ]}
				selectMultiple
				selectedIndex={null}
				selectedIndexes={this.props.repeat}
				onPress={this.props.change}
				containerStyle={[ color.background, styles.innerItem ]}
				textStyle={[ color.foreground ]}
				selectedButtonStyle={{ backgroundColor: colors.foreground }}
				selectedTextStyle={{ color: colors.background }}
			/>}
		/>;
	}
	
}

