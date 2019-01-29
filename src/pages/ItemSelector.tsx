import { Body, Container, Header, ListItem, Radio, Right, Text, Title } from 'native-base';
import * as React from 'react';
import NavigationComponent from '../components/NavigationComponent';

export default class ItemSelector extends NavigationComponent {
	
	state = {
		list:    this.props.navigation.getParam( 'list', [] ),
		// current value
		current: this.props.navigation.getParam( 'current' ),
		// called when value is selected
		select:  this.props.navigation.getParam( 'select' )
	};
	
	render() {
		const list = [];
		for ( let i = 0; i < this.state.list.length; ++i )
			list.push( this.item( i, this.state.list[ i ] ) );
		
		return <Container>
			{this.header()}
			{list}
			{/*<List*/}
			{/*dataArray={this.state.list}*/}
			{/*renderRow={this.item}*/}
			{/*/>*/}
		</Container>;
	}
	
	private header() {
		return <Header>
			{this.goBack()}
			<Body><Title>Select One</Title></Body>
			<Right/>
		</Header>;
	}
	
	private item = ( i, val ) => <ListItem
		key={i}
		button icon
		onPress={() => {
			this.setState( { current: i } );
			this.state.select( i );
		}}
	>
		<Body><Text>{val}</Text></Body>
		<Right><Radio selected={this.state.current === i}/></Right>
	</ListItem>;
	
}
