import * as _ from 'lodash';
import { Button, Icon, Left, Text } from 'native-base';
import * as React from 'react';
import { NavigationFocusInjectedProps } from 'react-navigation';
import { DispatchProp } from 'react-redux';

export default class NavigationComponent<T = {}> extends React.PureComponent<DispatchProp & NavigationFocusInjectedProps & T> {
	
	protected debounce( func: () => void ) {
		return _.debounce( func, 1000, { leading: true, trailing: false } );
	};
	
	protected goBack( text: string = 'Back' ) {
		return <Left>
			<Button
				transparent
				onPress={this.debounce( () => {
					this.props.navigation.goBack();
				} )}
			>
				<Icon name='arrow-back'/>
				<Text>{text}</Text>
			</Button>
		</Left>;
	}
	
}
