import React from 'react';
import { Button } from 'react-native';

export default class Delete extends React.PureComponent {
	
	props: {
		onPress: () => void
	};
	
	render(): JSX.Element {
		return <Button color={'#ff0000'} onPress={this.props.onPress} title='Delete'/>;
	}
	
}
