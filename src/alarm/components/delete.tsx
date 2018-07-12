import React from 'react';
import { Button } from 'react-native';

export default class Delete extends React.PureComponent {
	
	props: {
		onPress: () => void
	};
	
	render() {
		return <Button color={'red'} onPress={this.props.onPress} title='Delete'/>;
	}
	
}
