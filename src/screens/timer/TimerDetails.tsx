import { Body, Container, Header, Right, Title } from 'native-base';
import * as React from 'react';
import { connect } from 'react-redux';
import NavigationComponent from '../../components/NavigationComponent';
import { folderListItem } from '../../pages/FolderList';
import { folderListState } from '../../pages/FolderList/folderListStore';
import { AppState } from '../../store/store';

type Props = {
	items: folderListState
};

export default connect( ( store: AppState ) => {
		return {
			items: store.folderList
		} as Props;
	}
)( class TimerDetails extends NavigationComponent<Props> {
	
	state: { itemId: string } = {
		itemId: this.props.navigation.getParam( 'itemId' )
	};
	
	render() {
		let item = this.props.items[ this.state.itemId ];
		if ( !item ) return null;
		
		return <Container>
			{this.header( item )}
		</Container>;
	}
	
	private header( item: folderListItem ) {
		return <Header>
			{this.goBack()}
			<Body><Title>{item.name}</Title></Body>
			<Right/>
		</Header>;
	}
	
} );
