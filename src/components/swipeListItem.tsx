import React from 'react';
import { Text, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-swipeable';

import SwipeList from './swipeList';

import config, { colors } from '../config';

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
	
	state = {
		swipeable: null
	};
	
	static defaultProps = {
		leftButtons:      [],
		rightButtons:     [],
		leftButtonWidth:  75,
		rightButtonWidth: 75
	};
	
	
	render() {
		const { item, parent, renderItem, leftButtons, rightButtons, ...props } = this.props;
		
		return <Swipeable
			onSwipeStart={this.onSwipeStart}
			onSwipeRelease={this.onSwipeRelease}
			onRef={this.onRef}
			leftButtons={leftButtons.map(
				button =>
					<TouchableOpacity
						style={[ config.styles.flex, config.styles.center, {
							backgroundColor: button.color || colors.highlight,
							width:           this.props.leftButtonWidth
						} ]}
						onPress={button.onPress}
					>
						<Text style={[ config.colors.text ]}>{button.text}</Text>
					</TouchableOpacity>
			)}
			rightButtons={rightButtons.map(
				button =>
					<TouchableOpacity
						style={[ config.styles.flex, config.styles.center, {
							backgroundColor: button.color || colors.highlight,
							width:           this.props.rightButtonWidth
						} ]}
						onPress={button.onPress}
					>
						<Text style={[ config.colors.text ]}>{button.text}</Text>
					</TouchableOpacity>
			)}
			{...props}
		>
			{renderItem( item )}
		</Swipeable>
	}
	
	private onSwipeStart = () => {
		const { parent } = this.props,
				{ state }  = parent;
		parent.setState( { isSwiping: true } );
		if (state.currentSwipeable && state.currentSwipeable !== this.state.swipeable) {
			state.currentSwipeable.recenter();
		}
		parent.setState( { currentSwipeable: this.state.swipeable } );
	};
	
	private onSwipeRelease = () => {
		this.props.parent.setState( { isSwiping: false } );
	};
	
	private onRef = ( ref ) => {
		this.setState( { swipeable: ref } );
	};
	
}
