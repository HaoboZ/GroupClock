import { Body, Button, Container, Header, Left, List, Right, Subtitle, Text, Title, View } from 'native-base';
import * as React from 'react';
import { ListView, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Icon from '../components/Icon';
import NavigationComponent from '../components/NavigationComponent';
import debug from '../debug';
import store, { AppState } from '../store/store';
import styles from '../styles';
import FolderListModal, { FolderListModalParams } from './FolderList/FolderListModal';
import { folderListActions, folderListState } from './FolderList/folderListStore';

export enum FolderListType {
	Group,
	Item
}

export type folderListItem = {
	// type of item
	type: FolderListType
	// id of parent list
	parent: string
	// unique identifier
	id?: string
	name: string
	// value for sorting
	value: number
	// group only: filter items
	filter?: number
	// group only: list of children
	items?: { [ id: string ]: boolean }
}

type Props = {
	items: folderListState
};

export default connect( ( store: AppState ) => {
		return {
			items: store.folderList
		} as Props;
	}
)( class FolderList extends NavigationComponent <Props & {
	// route that is listed by react navigation
	routeName: string
	// initial key for home list
	initialListKey: string
	// initial name for home list
	initialListName?: string
	// name for new groups
	initialGroupName?: string
	// data for new groups
	initialGroupData?: ( list?: folderListItem ) => any
	// name for new items
	initialItemName?: string
	// data for new items
	initialItemData?: ( list?: folderListItem ) => any
	// load data for item in editing
	loadEdit?: ( item: folderListItem ) => any
	// subtitle for header
	subtitle?: ( list?: folderListItem ) => string
	// rendered on top of list and below header
	renderPreList?: ( list: folderListItem ) => JSX.Element
	// renders item
	renderItem: ( item: folderListItem, GroupNavigate: () => void, checked: boolean, updateChecked: () => void ) => JSX.Element
	// rendered for adding and editing items
	modalItemContent?: ( itemData: any, modal: FolderListModal ) => JSX.Element
	// rendered for adding and editing groups
	modalGroupContent?: ( itemData: any, modal: FolderListModal ) => JSX.Element
	// called when saving or editing item
	onSave?: ( item: folderListItem, data: any, id: string ) => folderListItem
	// called when deleting item
	onDelete?: ( item: folderListItem ) => void
}> {
	
	static defaultProps = {
		initialListName: 'List Home'
	};
	
	state: {
		listId: string
	} = {
		listId: this.props.navigation.getParam( 'listId', this.props.initialListKey )
	};
	
	private ds = new ListView.DataSource( { rowHasChanged: ( r1, r2 ) => r1 !== r2 } );
	
	constructor( props ) {
		super( props );
		
		// create the first item if it does not exist
		if ( !this.props.items[ this.state.listId ] ) this.init();
	}
	private init() {
		this.props.dispatch( folderListActions.saveItem( this.props.initialListKey, {
			type:   FolderListType.Group,
			parent: null,
			name:   this.props.initialListName,
			value:  0,
			filter: 0,
			items:  {}
		} ) );
		this.props.initialGroupData && this.props.onSave( {
			type: FolderListType.Group
		} as any, this.props.initialGroupData(), this.props.initialListKey );
	}
	
	render() {
		const list = this.props.items[ this.state.listId ];
		// if data has been reset, will need to run init
		if ( !list ) return this.reset();
		if ( !list.items ) list.items = {};
		
		return <Container>
			{this.header( list )}
			{this.props.renderPreList && this.props.renderPreList( list )}
			{FolderList.emptyList( list )}
			{this.list( list )}
		</Container>;
	}
	private reset() {
		return <Container>
			<Header>
				<Body><Title>{this.props.initialListName}</Title></Body>
			</Header>
			<Body style={styles.empty}>
			<Button onPress={this.init}><Text>Reset</Text></Button>
			</Body>
		</Container>;
	}
	
	private header( list: folderListItem ) {
		return <Header>
			{list.parent ? this.goBack() : <Left/>}
			<Body style={styles.widerHeader}>
			<Title>{list.name}</Title>
			{this.props.subtitle && <Subtitle>{this.props.subtitle( list )}</Subtitle>}
			</Body>
			<Right>{this.accessButtons( list )}</Right>
		</Header>;
	}
	private accessButtons( list: folderListItem ) {
		return <>
			<Button
				transparent icon
				style={styles.noPadHorizontal}
				onPress={() => {
					list.filter = ( list.filter + 1 ) % 4;
					this.props.dispatch( folderListActions.saveItem( list.id, list ) );
				}}
			>
				<Text>{[ 'A↑', 'Z↓', '1↑', '9↓' ][ list.filter ]}</Text>
			</Button>
			<Button
				transparent
				onPress={() => {
					this.props.navigation.navigate( 'FolderListModal', {
						title:        'Add Item',
						list,
						groupName:    this.props.initialGroupName,
						groupData:    this.props.initialGroupData,
						itemName:     this.props.initialItemName,
						itemData:     this.props.initialItemData,
						groupContent: this.props.modalGroupContent,
						itemContent:  this.props.modalItemContent,
						onSave:       this.props.onSave
					} as FolderListModalParams );
				}}
			>
				<Icon name='add'/>
			</Button>
		</>;
	}
	
	private static emptyList( list: folderListItem ) {
		if ( list.value ) return null;
		
		return <Body style={styles.empty}>
		<Text>No Items</Text>
		</Body>;
	}
	private list( list: folderListItem ) {
		if ( !Object.keys( list.items ).length ) return null;
		
		return <List
			closeOnRowBeginSwipe
			directionalLockEnabled
			disableRightSwipe
			rightOpenValue={-120}
			dataSource={this.ds.cloneWithRows( sort( list ) )}
			renderRow={this.renderItem( list )}
			renderRightHiddenRow={this.rightSwipe( list )}
		/>;
	}
	private renderItem( list: folderListItem ) {
		return ( item: folderListItem ) => {
			return this.props.renderItem( item,
				this.debounce( () => {
					if ( item.type === FolderListType.Group ) {
						if ( debug.navigate ) console.log( `Navigating deeper in ${this.props.routeName}` );
						this.props.navigation.push( this.props.routeName, {
							listId: item.id
						} );
					}
				} ),
				list.items[ item.id ],
				() => {
					list.items[ item.id ] = !list.items[ item.id ];
					this.props.dispatch( folderListActions.saveItem( list.id, list ) );
				}
			);
		};
	}
	
	private rightSwipe( list: folderListItem ) {
		return ( item, secId, rowId, rowMap ) => {
			return <View style={styles.row}>
				<Button
					style={innerStyle.swipeButton}
					onPress={() => {
						this.props.navigation.navigate( 'FolderListModal', {
							title:        'Edit Item',
							list,
							selectedItem: item,
							loadEdit:     this.props.loadEdit,
							groupContent: this.props.modalGroupContent,
							itemContent:  this.props.modalItemContent,
							onSave:       this.props.onSave
						} as FolderListModalParams );
					}}
				>
					<Icon name='create'/>
				</Button>
				<Button
					style={innerStyle.swipeButton}
					danger
					onPress={() => {
						this.deleteRow( list, item, secId, rowId, rowMap );
					}}
				>
					<Icon name='trash'/>
				</Button>
			</View>;
		};
	}
	private deleteRow( list: folderListItem, item: folderListItem, secId, rowId, rowMap ) {
		rowMap[ `${secId}${rowId}` ].props.closeRow();
		delete list.items[ item.id ];
		--list.value;
		
		this.props.dispatch( folderListActions.saveItem( list.id, list ) );
		this.delete( item );
	}
	private delete( list: folderListItem ) {
		if ( list.type === FolderListType.Group )
			for ( const id in list.items )
				this.delete( this.props.items[ id ] );
		
		this.props.onDelete && this.props.onDelete( list );
		this.props.dispatch( folderListActions.deleteItem( list.id ) );
	}
	
} );

export function sort( list: folderListItem ) {
	const compareFn = [ ( a, b ) => {
		      const x = a.name.toLowerCase(),
		            y = b.name.toLowerCase();
		
		      if ( x < y ) return -1;
		      if ( x > y ) return 1;
		      return a.value - b.value;
	      }, ( a, b ) => {
		      const x = a.name.toLowerCase(),
		            y = b.name.toLowerCase();
		
		      if ( x < y ) return 1;
		      if ( x > y ) return -1;
		      return a.value - b.value;
	      }, ( a, b ) => {
		      const diff = a.value - b.value;
		      if ( diff ) return diff;
		      const x = a.name.toLowerCase(),
		            y = b.name.toLowerCase();
		      if ( x < y ) return -1;
		      if ( x > y ) return 1;
		      return 0;
	      }, ( a, b ) => {
		      const diff = b.value - a.value;
		      if ( diff ) return diff;
		      const x = a.name.toLowerCase(),
		            y = b.name.toLowerCase();
		      if ( x < y ) return -1;
		      if ( x > y ) return 1;
		      return 0;
	      } ][ list.filter ],
	      items     = store.getState().folderList;
	return Object.keys( list.items ).map( ( id ) => items[ id ] ).sort( compareFn );
}

const innerStyle = StyleSheet.create( {
	swipeButton: {
		height:         '100%',
		width:          '50%',
		justifyContent: 'center',
		borderRadius:   0
	}
} );
