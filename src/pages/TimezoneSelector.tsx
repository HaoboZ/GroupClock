import * as _ from 'lodash';
import { Body, Container, Header, Input, Item, List, ListItem, Right, Text } from 'native-base';
import * as React from 'react';
import Icon from '../components/Icon';
import NavigationComponent from '../components/NavigationComponent';
import styles from '../styles';
import Timezone from '../utils/Timezone';

export default class TimezoneSelector extends NavigationComponent {
	
	state = {
		filter:   '',
		// current value
		current:  this.props.navigation.getParam( 'current' ),
		// called when value is changed
		onChange: this.props.navigation.getParam( 'onChange' ),
		// max items on list
		maxCount: this.props.navigation.getParam( 'maxCount', 50 )
	};
	
	render() {
		let count = 0;
		const timezones = Timezone.names.filter( ( val ) => {
			if ( count < this.state.maxCount
				&& val.match( RegExp( this.state.filter, 'i' ) ) ) {
				++count;
				return true;
			}
			return false;
		} ).map( ( val ) => Timezone.NTZ[ val ] );
		
		return <Container>
			{this.header()}
			{!timezones.length
				? this.empty()
				: this.list( timezones )}
		</Container>;
	}
	
	private header() {
		return <Header searchBar rounded>
			{this.goBack()}
			{this.searchBar()}
			<Right>{this.selected()}</Right>
		</Header>;
	}
	private searchBar() {
		return <Item style={styles.widerHeader}>
			<Icon name='search'/>
			<Input
				placeholder='Filter Zones'
				clearTextOnFocus
				onChangeText={_.throttle( ( filter: string ) => {
					this.setState( { filter: filter.toLowerCase() } );
				}, 500 )}
			/>
		</Item>;
	}
	private selected() {
		return <Text note>
			{Timezone.ZTN[ this.state.current ].split( ',' )[ 0 ]}
		</Text>;
	}
	
	private empty() {
		return <Body style={styles.empty}>
		<Text>No Filtered Timezones</Text>
		</Body>;
	}
	private list( timezones ) {
		return <List
			dataArray={timezones}
			renderRow={this.item}
		/>;
	}
	private item = ( zone ) => <ListItem
		button icon
		onPress={() => {
			this.state.onChange( zone );
			this.setState( { current: zone } );
		}}
	>
		<Body><Text>{Timezone.ZTN[ zone ]}</Text></Body>
		<Right>
			<Text note>
				{Timezone.getUTC( zone )}
			</Text>
		</Right>
	</ListItem>;
	
}
