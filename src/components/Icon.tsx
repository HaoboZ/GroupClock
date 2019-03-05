import { Icon as _Icon } from 'native-base';
import * as React from 'react';
import { Platform, TextStyle } from 'react-native';

export default class Icon extends React.PureComponent<{
	name?: string
	ios?: string
	android?: string
	style?: TextStyle
	active?: boolean
}> {
	
	render() {
		let { name, ios, android, style, active } = this.props;
		
		switch ( Platform.OS ) {
		case 'ios':
			name = ios || 'ios-' + name;
			break;
		case 'android':
			name = android || 'md-' + name;
			break;
		}
		
		return <_Icon
			name={name}
			style={style}
			active={active}
		/>;
	}
	
}
