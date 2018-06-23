import React from 'react';
import { FlatList, FlatListProps } from 'react-native';

import SwipeListItem, { SwipeListItemProps } from './swipeListItem';

import config from '../config';

type SwipeListProps = FlatListProps<any> & SwipeListItemProps;

export default class extends React.PureComponent {
	
	props: SwipeListProps;
	
	state = {
		isSwiping:        false,
		currentSwipeable: null
	};
	
	
	render() {
		return <FlatList
			style={[ config.styles.flex ]}
			scrollEnabled={!this.state.isSwiping}
			onScroll={this.onScroll.bind( this )}
			keyExtractor={( item, index ) => index.toString()}
			{...this.props}
			renderItem={this.renderItem.bind( this )}
		/>;
	}
	
	private onScroll() {
		if (this.state.currentSwipeable) {
			this.state.currentSwipeable.recenter();
			this.setState( { currentSwipeable: null } );
		}
	}
	
	private renderItem( data ) {
		const { leftContent, rightContent, leftButtons, rightButtons, leftActionActivationDistance, onLeftActionRelease, rightActionActivationDistance, onRightActionRelease, leftButtonWidth, rightButtonWidth } = this.props;
		
		const props = {
			leftContent,
			rightContent,
			leftButtons,
			rightButtons,
			leftActionActivationDistance,
			onLeftActionRelease,
			rightActionActivationDistance,
			onRightActionRelease,
			leftButtonWidth,
			rightButtonWidth
		};
		
		return <SwipeListItem parent={this} item={data.item} renderItem={this.props.renderItem} {...props}/>;
	}
	
}
