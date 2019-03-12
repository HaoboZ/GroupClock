import { Body, Container, Header, List, ListItem, Right, Text, Title } from 'native-base';
import * as React from 'react';
import { connect } from 'react-redux';
import NavigationComponent from '../../components/NavigationComponent';
import { folderListItem } from '../../pages/FolderList';
import { folderListState } from '../../pages/FolderList/folderListStore';
import { AppState } from '../../store/store';
import WatchItem from './WatchItem';

type Props = {
	items: folderListState
};

export default connect( ( store: AppState ) => {
		return {
			items: store.folderList
		} as Props;
	}
)( class WatchDetails extends NavigationComponent<Props> {
	
	state: { itemId: string } = {
		itemId: this.props.navigation.getParam( 'itemId' )
	};
	
	render() {
		let item = this.props.items[ this.state.itemId ];
		if ( !item ) return null;
		let stopwatch = new WatchItem( item );
		
		return <Container>
			{this.header( item )}
			{/*{this.time( stopwatch )}*/}
			{this.laps( stopwatch )}
		</Container>;
	}
	
	private header( item: folderListItem ) {
		return <Header>
			{this.goBack()}
			<Body><Title>{item.name}</Title></Body>
			<Right/>
		</Header>;
	}
	
	// private time( stopwatch: WatchItem ) {
	// 	return <Body style={{
	// 		justifyContent: 'center',
	// 		height:         100
	// 	}}>
	// 	<H1>{stopwatch.toString( stopwatch.time )}</H1>
	// 	</Body>;
	// }
	
	private laps( stopwatch: WatchItem ) {
		return <List
			dataArray={stopwatch.lapDiff}
			renderRow={( item ) => {
				return <ListItem>
					<Body><Text>{stopwatch.toString( item )}</Text></Body>
				</ListItem>;
			}}
		/>;
	}
	
} );
