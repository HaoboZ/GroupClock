import { Body, Button, H1, Left, ListItem, NativeBase, Right, Text } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Icon from '../../components/Icon';
import NavigationComponent from '../../components/NavigationComponent';
import FolderList, { folderListItem, FolderListType } from '../../pages/FolderList';
import { folderListActions, folderListState } from '../../pages/FolderList/folderListStore';
import { AppState } from '../../store/store';
import WatchItem, { State, watchItemData } from './WatchItem';
import { watchState } from './watchStore';

type Props = {
	time: number,
	items: folderListState,
	watches: watchState
};

export default connect( ( store: AppState ) => {
		return {
			time:    store.time,
			items:   store.folderList,
			watches: store.stopwatch
		} as Props;
	}
)( class WatchScreen extends NavigationComponent<Props> {
	
	render() {
		return <FolderList
			routeName='WatchScreen'
			initialListKey='WatchHome'
			initialListName='Stopwatch Home'
			initialItemName='Stopwatch'
			loadEdit={item => this.props.watches[ item.id ]}
			renderPreList={this.groupControl}
			renderItem={this.renderItem}
			onSave={( item, itemData: watchItemData, id ) => {
				if ( item.type === FolderListType.Item )
					WatchItem.create( id, itemData );
				return item;
			}}
			onDelete={( item ) => {
				if ( item.type === FolderListType.Item )
					new WatchItem( item ).delete();
			}}
			
			navigation={this.props.navigation}
			isFocused={this.props.isFocused}
		/>;
	}
	
	private groupControl = ( list: folderListItem ) => {
		let checked, partial = false;
		for ( let id in list.items ) {
			if ( checked === undefined ) checked = list.items[ id ];
			if ( checked !== list.items[ id ] ) {
				partial = true;
				break;
			}
		}
		
		return <ListItem style={styles.listItem}>
			{this.checkBox( () => {
				for ( let id in list.items ) {
					list.items[ id ] = !checked;
				}
				this.props.dispatch( folderListActions.saveItem( list.id, list ) );
			}, checked, partial )}
			<Body style={styles.center}/>
			<Right style={styles.right}>
				{this.circleButton( {
					dark:    true,
					onPress: () => {
						this.activate( list, ( item ) => {
							new WatchItem( item ).leftAction();
						} );
					}
				}, 'arrow-round-down' )}
				{this.circleButton( {
					dark:    true,
					onPress: () => {
						this.activate( list, ( item ) => {
							new WatchItem( item ).rightAction();
						} );
					}
				}, 'arrow-round-down' )}
			</Right>
		</ListItem>;
	};
	
	private renderItem = ( item: folderListItem, GroupNavigate, checked: boolean, updateChecked ) => {
		return <ListItem
			button
			style={styles.listItem}
			onPress={item.type === FolderListType.Group ? GroupNavigate : () => {
				this.props.navigation.navigate( 'WatchDetails', {
					itemId: item.id
				} );
			}}
		>
			{this.checkBox( updateChecked, checked )}
			{item.type === FolderListType.Group ? this.group( item ) : this.item( new WatchItem( item ) )}
		</ListItem>;
	};
	private group( item: folderListItem ) {
		return <Body style={styles.body}>
		<H1 numberOfLines={1}>{item.name}</H1>
		<Text>Items: {item.value}</Text>
		</Body>;
	}
	private item( stopwatch: WatchItem ) {
		return <>
			<Body style={styles.center}>
			<H1 numberOfLines={1}>{stopwatch.item.name}</H1>
			<Text>Time: {stopwatch.timeString( this.props.time )}</Text>
			<Text>Lap: {stopwatch.toString( stopwatch.lapDiff[ 0 ] )}</Text>
			</Body>
			<Right style={styles.right}>
				{this.circleButton( {
					[ [ undefined, 'dark', 'dark' ][ stopwatch.data.state ] ]: true,
					
					disabled: stopwatch.data.state === State.OFF,
					onPress:  () => stopwatch.leftAction()
				}, [ 'repeat', 'repeat', 'square' ][ stopwatch.data.state ] )}
				{this.circleButton( {
					[ [ 'success', 'danger', 'success' ][ stopwatch.data.state ] ]: true,
					
					onPress: () => stopwatch.rightAction()
				}, [ 'play', 'pause', 'play' ][ stopwatch.data.state ] )}
			</Right>
		</>;
	}
	
	private checkBox( updateChecked, checked: boolean, partial?: boolean ) {
		return <Left>
			<Button full transparent onPress={updateChecked} style={styles.left}>
				<Icon
					style={styles.fullIcon}
					name={partial ? 'remove-circle-outline' : `radio-button-${checked ? 'on' : 'off'}`}
				/>
			</Button>
		</Left>;
	}
	private activate( list: folderListItem, func: ( item: folderListItem ) => void ) {
		if ( list.type !== FolderListType.Group ) {
			func( list );
			return;
		}
		for ( let id in list.items ) {
			if ( list.items[ id ] === true )
				this.activate( this.props.items[ id ], func );
		}
	}
	
	private circleButton( props: NativeBase.Button, text: string ) {
		return <Button
			style={styles.circular}
			{...props}
		>
			<Icon name={text}/>
		</Button>;
	}
	
} );

let size = 52;

const styles = StyleSheet.create( {
	listItem:         { height: 72, marginLeft: 0 },
	body:             { flex: 7 },
	center:           { flex: 4 },
	left:             {
		height: 72,
		width:  '100%'
	},
	right:            {
		flex:           3,
		flexDirection:  'row',
		justifyContent: 'space-between'
	},
	circular:         {
		justifyContent: 'center',
		width:          size,
		height:         size,
		borderRadius:   size / 2
	},
	circleButtonText: {
		paddingLeft:  0,
		paddingRight: 0
	},
	fullIcon:         {
		marginLeft:  0,
		marginRight: 0
	}
} );
