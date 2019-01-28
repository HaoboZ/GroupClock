import { Body, Button, Container, Content, Header, Input, Item, Label, Right, Tab, Tabs, Text, Title } from 'native-base';
import * as React from 'react';
import * as shortid from 'shortid';
import NavigationComponent from '../../components/NavigationComponent';
import store from '../../store/store';
import { folderListItem, FolderListType } from '../FolderList';
import { folderListActions } from './folderListStore';

export type FolderListModalParams = {
	// display title on top
	title: string
	// editing only: item id to save item
	selectedItem?: folderListItem
	// editing only: retrieve initial parameters
	loadEdit?: ( item: folderListItem ) => any
	// creating only: list to add item to
	list?: folderListItem
	// creating only: initial group name
	groupName?: string
	// creating only: initial group data
	groupData?: ( list: folderListItem ) => any
	// creating only: initial item name
	itemName?: string
	// creating only: initial item data
	itemData?: ( list: folderListItem ) => any
	// display to modify group
	groupContent: ( itemData: any, modal: FolderListModal ) => JSX.Element
	// display to modify item
	itemContent: ( itemData: any, modal: FolderListModal ) => JSX.Element
	// called when saving
	onSave: ( item: folderListItem, itemData: any, id: string ) => folderListItem
}

export default class FolderListModal extends NavigationComponent {
	
	private title: string = this.props.navigation.getParam( 'title' );
	
	public list: folderListItem = this.props.navigation.getParam( 'list' );
	
	private groupTabName: string = this.props.navigation.getParam( 'groupName' ) || 'Group';
	private _groupContent = this.props.navigation.getParam( 'groupContent' );
	private itemTabName: string = this.props.navigation.getParam( 'itemName' ) || 'Item';
	private _itemContent = this.props.navigation.getParam( 'itemContent' );
	
	private onSave = this.props.navigation.getParam( 'onSave' );
	private saved = false;
	
	private readonly creating: boolean = true;
	// type of item being edited
	private readonly type: FolderListType;
	
	state: {
		group: folderListItem
		groupData: any
		item: folderListItem
		itemData: any
		selectedTab: number
	} = {
		group:       null,
		groupData:   undefined,
		item:        null,
		itemData:    undefined,
		selectedTab: 0
	};
	
	constructor( props ) {
		super( props );
		
		let selectedItem: folderListItem = this.props.navigation.getParam( 'selectedItem' );
		// if is editing
		if ( selectedItem ) {
			this.creating = false;
			this.type = selectedItem.type;
			let selectedData = this.attemptCall( this.props.navigation.getParam( 'loadEdit' ), selectedItem );
			if ( this.type === FolderListType.Group ) {
				this.state.group = { ...selectedItem };
				this.state.groupData = { ...selectedData };
			} else {
				this.state.item = { ...selectedItem };
				this.state.itemData = { ...selectedData };
			}
		} else {
			this.state.group = {
				type:   FolderListType.Group,
				parent: this.list.id,
				items:  {},
				name:   this.groupTabName,
				value:  0,
				filter: 0
			};
			this.state.groupData = { ...this.attemptCall( this.props.navigation.getParam( 'groupData' ), this.list ) };
			this.state.item = {
				type:   FolderListType.Item,
				parent: this.list.id,
				name:   this.itemTabName,
				value:  0
			};
			this.state.itemData = { ...this.attemptCall( this.props.navigation.getParam( 'itemData' ), this.list ) };
		}
		// starting tab
		this.state.selectedTab = this.type === FolderListType.Group ? 1 : 0;
	}
	
	render() {
		return <Container>
			{this.header()}
			{this.tabs()}
		</Container>;
	}
	
	private header() {
		return <Header hasTabs>
			{this.goBack( 'Cancel' )}
			<Body><Title>{this.title}</Title></Body>
			<Right>{this.save()}</Right>
		</Header>;
	}
	private save() {
		return <Button
			transparent
			onPress={() => {
				let item = this.state.selectedTab ? this.state.group : this.state.item,
				    data = this.state.selectedTab ? this.state.groupData : this.state.itemData;
				if ( !item.name.length ) {
					alert( 'Name is empty' );
					return;
				}
				
				if ( this.saved ) return;
				this.saved = true;
				
				// generate/get id
				let itemId = this.creating ? shortid.generate() : item.id;
				// perform modifications
				if ( this.onSave ) item = this.onSave( item, data, itemId );
				// save item and parent
				store.dispatch( folderListActions.saveItem( itemId, item ) );
				if ( this.creating ) {
					this.list.items[ itemId ] = true;
					++this.list.value;
					store.dispatch( folderListActions.saveItem( this.list.id, this.list ) );
				}
				this.props.navigation.goBack();
			}}
		>
			<Text>Save</Text>
		</Button>;
	}
	
	private tabs() {
		return <Tabs
			initialPage={this.type === FolderListType.Group ? 1 : 0}
			page={this.creating ? undefined : this.state.selectedTab}
			onChangeTab={( { i } ) => {
				if ( this.creating )
					this.setState( { selectedTab: i } );
				else
					this.forceUpdate();
			}}
		>
			<Tab heading={this.itemTabName}>
				{this.itemContent()}
			</Tab>
			<Tab heading={this.groupTabName}>
				{this.groupContent()}
			</Tab>
		</Tabs>;
	}
	
	private itemContent() {
		if ( !this.creating && this.type !== FolderListType.Item ) return null;
		
		return <Content>
			<Item stackedLabel>
				<Label>Name</Label>
				<Input
					value={this.state.item.name}
					selectTextOnFocus
					onChangeText={( text ) => {
						this.setState( ( state: any ) => ( { item: { ...state.item, name: text } } ) );
					}}
				/>
			</Item>
			{this._itemContent && this._itemContent( this.state.itemData, this )}
		</Content>;
	}
	private groupContent() {
		if ( !this.creating && this.type !== FolderListType.Group ) return null;
		
		return <Content>
			<Item stackedLabel>
				<Label>Name</Label>
				<Input
					value={this.state.group.name}
					onChangeText={( text ) => {
						this.setState( ( state: any ) => ( { group: { ...state.group, name: text } } ) );
					}}
				/>
			</Item>
			{this._groupContent && this._groupContent( this.state.groupData, this )}
		</Content>;
	}
	
	private attemptCall( func: Function, ...args ) {
		if ( !func ) return null;
		return func.apply( null, args );
	}
	
}
