import { Body, H1, ListItem, Right, Text } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import FolderList, { folderListItem, FolderListType } from '../../pages/FolderList';
import { folderListActions, folderListState } from '../../pages/FolderList/folderListStore';
import { AppState } from '../../store/store';
import CommonScreen from '../CommonScreen';
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
)( class WatchScreen extends CommonScreen<Props> {
	
	render() {
		return <FolderList
			routeName='WatchScreen'
			initialListKey='WatchHome'
			initialListName='Stopwatch Home'
			initialItemName='Stopwatch'
			loadEdit={item => this.props.watches[ item.id ]}
			
			{...this.listProps()}
		/>;
	}
	
	protected groupControl = ( list: folderListItem ) => {
		let checked, partial = false;
		for ( const id in list.items ) {
			if ( checked === undefined ) checked = list.items[ id ];
			if ( checked !== list.items[ id ] ) {
				partial = true;
				break;
			}
		}
		
		return <ListItem style={innerStyle.listItem}>
			{this.checkBox( () => {
				for ( const id in list.items )
					list.items[ id ] = !checked;
				
				this.props.dispatch( folderListActions.saveItem( list.id, list ) );
			}, checked, partial )}
			<Body style={innerStyle.center}/>
			<Right style={innerStyle.right}>
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
	
	protected itemRoute = 'WatchDetails';
	protected createGroup = ( item: folderListItem ) => item;
	protected group( item: folderListItem ) {
		return <Body style={innerStyle.body}>
		<H1 numberOfLines={1}>{item.name}</H1>
		<Text>Items: {item.value}</Text>
		</Body>;
	}
	protected createItem = ( item: folderListItem ) => new WatchItem( item );
	protected item( stopwatch: WatchItem ) {
		return <>
			<Body style={innerStyle.center}>
			<H1 numberOfLines={1}>{stopwatch.item.name}</H1>
			<Text>Time: {stopwatch.timeString( this.props.time )}</Text>
			<Text>Lap: {stopwatch.toString( stopwatch.lapDiff[ 0 ] )}</Text>
			</Body>
			<Right style={innerStyle.right}>
				{this.circleButton( {
					[ [ undefined, 'dark', 'danger' ][ stopwatch.data.state ] ]: true,
					
					disabled: stopwatch.data.state === State.OFF,
					onPress:  () => stopwatch.leftAction()
				}, [ 'repeat', 'repeat', 'square' ][ stopwatch.data.state ] )}
				{this.circleButton( {
					[ [ 'success', 'warning', 'success' ][ stopwatch.data.state ] ]: true,
					
					onPress: () => stopwatch.rightAction()
				}, [ 'play', 'pause', 'play' ][ stopwatch.data.state ] )}
			</Right>
		</>;
	}
	
	protected groupModal = undefined;
	protected itemModal = undefined;
	
	protected onSave = ( item: folderListItem, data: watchItemData, id: string ) => {
		if ( item.type === FolderListType.Item )
			WatchItem.create( id, data );
		return item;
	};
	protected onDelete = ( item: folderListItem ) => {
		if ( item.type === FolderListType.Item )
			new WatchItem( item ).delete();
	};
	
} );

const innerStyle = StyleSheet.create( {
	listItem: { height: 72, marginLeft: 0 },
	body:     { flex: 7 },
	center:   { flex: 4 },
	right:    {
		flex:           3,
		flexDirection:  'row',
		justifyContent: 'space-between'
	}
} );
