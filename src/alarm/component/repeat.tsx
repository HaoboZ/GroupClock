import React from 'react';
import { StyleSheet } from 'react-native';
import { ButtonGroup, ListItem } from 'react-native-elements';

import { theme } from '../../config';
import { themeStyle } from '../../styles';
import styles from './styles';

export default class Repeat extends React.PureComponent {
	
	props: {
		repeat: Array<number>,
		change: ( Array ) => void
	};
	
	render(): JSX.Element {
		return <ListItem
			containerStyle={[ styles.Item, style.padding ]}
			title='Repeat'
			titleStyle={[ themeStyle.foreground ]}
			rightElement={<ButtonGroup
				buttons={[ 'Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa' ]}
				selectMultiple
				selectedIndex={null}
				selectedIndexes={this.props.repeat}
				onPress={this.props.change}
				containerStyle={[ themeStyle.background, styles.innerItem ]}
				textStyle={[ themeStyle.foreground ]}
				selectedButtonStyle={[ style.selectButton ]}
				selectedTextStyle={[ style.selectText ]}
			/>}
		/>;
	}
	
}

const style = StyleSheet.create( {
	padding:      { paddingRight: 0 },
	selectButton: { backgroundColor: theme.foreground },
	selectText:   { color: theme.background }
} );
