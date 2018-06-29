import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-swipeable';
import SwipeList from './swipeList';

import { colors } from '../config';
import { color, style } from '../styles';

export type SwipeListItemProps = {
	leftContent?: React.ReactElement<any>,
	rightContent?: React.ReactElement<any>,
	leftButtons?: Array<{ text?: string, color?: string, onPress?: () => void }>,
	rightButtons?: Array<{ text?: string, color?: string, onPress?: () => void }>,
	leftActionActivationDistance?: number,
	onLeftActionRelease?: () => void,
	rightActionActivationDistance?: number,
	onRightActionRelease?: () => void,
	leftButtonWidth?: number,
	rightButtonWidth?: number
};

export default class SwipeListItem extends React.PureComponent {
	
	props: SwipeListItemProps & {
		item,
		parent: SwipeList,
		renderItem
	};
	
	static defaultProps = {
		leftButtons:      [],
		rightButtons:     [],
		leftButtonWidth:  75,
		rightButtonWidth: 75
	};
	
	state = {
		swipeable: null
	};
	
	render() {
		const { item, parent, renderItem, leftButtons, rightButtons, ...props } = this.props;
		
		return <Swipeable
			onSwipeStart={this.swipeable.onSwipeStart}
			onSwipeRelease={this.swipeable.onSwipeRelease}
			onRef={this.swipeable.onRef}
			leftButtons={this.swipeable.map( leftButtons )}
			rightButtons={this.swipeable.map( rightButtons, true )}
			{...props}
		>
			{renderItem( item )}
		</Swipeable>
	}
	
	private swipeable = {
		onSwipeStart:   () => {
			const { parent } = this.props,
					{ state }  = parent;
			parent.setState( { isSwiping: true } );
			if ( state.currentSwipeable && state.currentSwipeable !== this.state.swipeable ) {
				state.currentSwipeable.recenter();
			}
			parent.setState( { currentSwipeable: this.state.swipeable } );
		},
		onSwipeRelease: () => {
			this.props.parent.setState( { isSwiping: false } );
		},
		onRef:          ( ref ) => {
			this.setState( { swipeable: ref } );
		},
		map:            ( buttons: Array<{ text?: string, color?: string, onPress?: () => void }>, right = false ) => {
			buttons.map(
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
