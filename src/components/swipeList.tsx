import React from 'react';
import { FlatList, FlatListProps } from 'react-native';
import SwipeListItem, { SwipeListItemProps } from './swipeListItem';

import { style } from '../styles';

export default class SwipeList extends React.PureComponent {
	
	props: FlatListProps<any> & SwipeListItemProps;
	
	state = {
		isSwiping:        false,
		currentSwipeable: null
	};
	
	render() {
		return <FlatList
			style={[ style.flex ]}
			scrollEnabled={!this.state.isSwiping}
			onScroll={this.list.onScroll}
			keyExtractor={this.list.keyExtractor}
			{...this.props}
			renderItem={this.list.renderItem}
		/>;
	}
	
	private list = {
		onScroll:     () => {
			if ( this.state.currentSwipeable ) {
				this.state.currentSwipeable.recenter();
				this.setState( { currentSwipeable: null } );
			}
		},
		keyExtractor: ( item, index ) => index.toString(),
		renderItem:   ( data ) => {
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
			
			return <SwipeListItem parent={this} data={data} renderItem={this.props.renderItem} {...props}/>;
		}
	}
	
}
