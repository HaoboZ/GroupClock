import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-swipeable';
import SwipeList from './swipeList';

import { colors } from '../config';
import { color, style } from '../styles';

export type SwipeListItemProps = {
	leftContent?: React.ReactElement<any>,
	rightContent?: React.ReactElement<any>,
	leftButtons?: ( ( item: any ) => Array<{ text?: string, color?: string, onPress?: () => void }> )
		| Array<{ text?: string, color?: string, onPress?: () => void }>,
	rightButtons?: ( ( item: any ) => Array<{ text?: string, color?: string, onPress?: () => void }> )
		| Array<{ text?: string, color?: string, onPress?: () => void }>,
	leftActionActivationDistance?: number,
	onLeftActionRelease?: () => void,
	rightActionActivationDistance?: number,
	onRightActionRelease?: () => void,
	leftButtonWidth?: number,
	rightButtonWidth?: number
};

export default class SwipeListItem extends React.PureComponent {
	
	props: SwipeListItemProps & {
		parent?: SwipeList,
		data: any,
		renderItem: ( any ) => void
	};
	
	static defaultProps = {
		parent:           null,
		leftButtons:      [],
		rightButtons:     [],
		leftButtonWidth:  75,
		rightButtonWidth: 75
	};
	
	state = {
		swipeable: null,
	};
	
	render(): JSX.Element {
		// noinspection JSUnusedLocalSymbols
		let { data, parent, renderItem, leftButtons, rightButtons, ...props } = this.props;
		
		if ( typeof leftButtons === 'function' )
			leftButtons = leftButtons( data ) as any;
		if ( typeof rightButtons === 'function' )
			rightButtons = rightButtons( data ) as any;
		
		return <Swipeable
			onSwipeStart={this.swipeable.onSwipeStart}
			onSwipeRelease={this.swipeable.onSwipeRelease}
			onRef={this.swipeable.onRef}
			leftButtons={this.swipeable.map( leftButtons as any )}
			rightButtons={this.swipeable.map( rightButtons as any, true )}
			{...props}
		>
			{renderItem( data )}
		</Swipeable>
	}
	
	private swipeable = {
		onSwipeStart:   () => {
			const { parent } = this.props;
			if ( !parent )
				return;
			const { state } = parent;
			
			parent.setState( { isSwiping: true } );
			if ( state.currentSwipeable && state.currentSwipeable !== this.state.swipeable )
				state.currentSwipeable.recenter();
			
			parent.setState( { currentSwipeable: this.state.swipeable } );
		},
		onSwipeRelease: () => {
			const { parent } = this.props;
			if ( !parent )
				return;
			parent.setState( { isSwiping: false } );
		},
		onRef:          ( swipeable ) => {
			this.setState( { swipeable } );
		},
		map:            ( buttons: Array<{ text?: string, color?: string, onPress?: () => void }>, right = false ) => {
			return buttons.map(
				button =>
					<TouchableOpacity
						style={[ style.flex, style.center, {
							backgroundColor: button.color || colors.highlight,
							width:           right ? this.props.leftButtonWidth : this.props.rightButtonWidth
						} ]}
						onPress={button.onPress}
					>
						<Text style={[ color.foreground ]}>{button.text}</Text>
					</TouchableOpacity>
			)
		}
	};
	
}
