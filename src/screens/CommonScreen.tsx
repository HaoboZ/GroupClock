import { Button, Left, ListItem, NativeBase } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import Icon from '../components/Icon';
import NavigationComponent from '../components/NavigationComponent';
import { folderListItem, FolderListType } from '../pages/FolderList';
import FolderListModal from '../pages/FolderList/FolderListModal';
import styles from '../styles';

export default abstract class CommonScreen<T extends { items }> extends NavigationComponent<T> {
	
	protected listProps() {
		return {
			renderPreList:     this.groupControl,
			renderItem:        this.renderItem,
			modalGroupContent: this.groupModal,
			modalItemContent:  this.itemModal,
			onSave:            this.onSave,
			onDelete:          this.onDelete,
			
			navigation: this.props.navigation,
			isFocused:  this.props.isFocused
		};
	}
	
	protected abstract groupControl( list: folderListItem );
	
	protected abstract itemRoute: string;
	private renderItem = ( item: folderListItem, GroupNavigate, checked: boolean, updateChecked ) => {
		return <ListItem
			button
			style={innerStyle.listItem}
			onPress={item.type === FolderListType.Group ? GroupNavigate : () => {
				this.props.navigation.navigate( this.itemRoute, {
					itemId: item.id
				} );
			}}
		>
			{this.checkBox( updateChecked, checked )}
			{item.type === FolderListType.Group
				? this.group( this.createGroup( item ) )
				: this.item( this.createItem( item ) )}
		</ListItem>;
	};
	protected abstract createGroup( item: folderListItem );
	protected abstract group( group: any );
	protected abstract createItem( item: folderListItem );
	protected abstract item( item: any );
	
	protected abstract groupModal( data: any, modal: FolderListModal );
	protected abstract itemModal( data: any, modal: FolderListModal );
	
	protected abstract onSave( item: folderListItem, data: any, id: string );
	protected abstract onDelete( item: folderListItem );
	
	protected checkBox( updateChecked, checked: boolean, partial?: boolean ) {
		return <Left>
			<Button
				full transparent
				onPress={updateChecked}
				style={innerStyle.left}
			>
				<Icon
					style={styles.noMarginHorizontal}
					name={partial ? 'remove-circle-outline' : `radio-button-${checked ? 'on' : 'off'}`}
				/>
			</Button>
		</Left>;
	}
	protected activate( list: folderListItem, func: ( item: folderListItem ) => void ) {
		if ( list.type !== FolderListType.Group ) {
			func( list );
			return;
		}
		
		for ( const id in list.items ) {
			if ( list.items[ id ] === true )
				this.activate( this.props.items[ id ], func );
		}
	}
	
	protected circleButton( props: NativeBase.Button, name: string ) {
		return <Button
			style={innerStyle.circular}
			{...props}
		>
			<Icon name={name}/>
		</Button>;
	}
	
}

const itemHeight = 72, circleSize = 52;
const innerStyle = StyleSheet.create( {
	listItem: { height: itemHeight, marginLeft: 0 },
	left:     { height: itemHeight, width: '100%' },
	circular: {
		justifyContent: 'center',
		width:          circleSize,
		height:         circleSize,
		borderRadius:   circleSize / 2
	}
} );
