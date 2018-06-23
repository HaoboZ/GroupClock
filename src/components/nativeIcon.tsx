import React from 'react';
import { Platform } from 'react-native';
import { Button, Icon as _Icon } from 'react-native-elements';

import config from '../config';

export default class Icon extends React.PureComponent {
	
	props: {
		name: string,
		size?: number,
		color?: string,
		outline?: boolean
	};
	
	render() {
		let iconName = ( Platform.OS === 'android' ? 'md-' : 'ios-' ) + `${this.props.name}`;
		if (Platform.OS === 'ios' && this.props.outline)
			iconName = `${iconName}-outline`;
		
		return <_Icon type='ionicon' name={iconName} size={this.props.size} color={this.props.color}/>;
	}
	
}

export class IconButton extends React.PureComponent {
	
	props: {
		name: string,
		size?: number,
		color?: string,
		onPress?: () => void,
		outline?: boolean
	};
	
	render() {
		let { onPress, ...props } = this.props;
		
		return <Button
			clear
			style={config.styles.buttonPadding}
			title=''
			icon={<Icon {...props}/>}
			onPress={onPress}
		/>
	}
	
}
