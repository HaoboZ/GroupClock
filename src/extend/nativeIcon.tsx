import React from 'react';
import { Platform } from 'react-native';
import { Button, Icon } from 'react-native-elements';

import { style } from '../styles';
import { colors } from '../config';

export default class NativeIcon extends React.PureComponent {
	
	props: {
		name: string,
		size?: number,
		color?: string,
		outline?: boolean
	};
	
	static defaultProps = {
		color: colors.highlight
	};
	
	render(): JSX.Element {
		let iconName = ( Platform.OS === 'android' ? 'md-' : 'ios-' ) + `${this.props.name}`;
		if ( Platform.OS === 'ios' && this.props.outline )
			iconName = `${iconName}-outline`;
		
		return <Icon type='ionicon' name={iconName} size={this.props.size} color={this.props.color}/>;
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
	
	render(): JSX.Element {
		let { onPress, ...props } = this.props;
		
		return <Button
			clear
			style={style.buttonPadding}
			title=''
			icon={<NativeIcon {...props}/>}
			onPress={onPress}
		/>
	}
	
}
