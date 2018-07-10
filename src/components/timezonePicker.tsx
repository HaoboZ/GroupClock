import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';
import moment from 'moment-timezone';

import { colors } from '../config';
import { color, style } from '../styles';

export default class TimezonePicker extends React.PureComponent {
	
	props: {
		tz: string,
		setTZ: ( string ) => void,
		timeout?: number
	};
	
	static defaultProps = {
		timeout: 250
	};
	
	state = {
		text:     '',
		timeout:  0,
		searchTZ: []
	};
	
	private set = {
		text:        ( text ) => {
			if ( this.state.timeout )
				clearTimeout( this.state.timeout );
			
			this.setState( {
				timeout: setTimeout( () => {
					let searchTZ = [];
					if ( text.length ) {
						searchTZ =
							this.tzs
								.map( tz => tz.includes( text ) ? tz : null )
								.filter( tz => tz != null )
								.slice( 0, 10 );
					}
					this.setState( { text, searchTZ } );
				}, this.props.timeout )
			} );
		},
		searchReset: () => this.setState( { searchTZ: [] } )
	};
	
	private tzs: Array<string> = moment.tz.names();
	
	render() {
		return <View style={[ style.flex ]}>
			{this.state.searchTZ.length ? null : <ListItem
				containerStyle={[ color.background ]}
				titleStyle={[ color.foreground ]}
				title={this.props.tz}
				rightElement={
					<Text style={[ color.foreground ]}>{this.search.getTZ( this.props.tz )}</Text>}
			/>}
			<SearchBar
				platform='ios'
				onChangeText={this.set.text}
				clearIcon={null}
				clearButtonMode='always'
				cancelButtonTitle=''
				value={this.state.text}
				keyboardAppearance='dark'
				containerStyle={[ color.background ]}
				inputContainerStyle={[ color.navigation ]}
				inputStyle={[ color.foreground ]}
				placeholder='Search'
				placeholderTextColor={colors.contrast}
			/>
			<FlatList
				renderItem={this.search.renderItem}
				data={this.state.searchTZ}
				keyExtractor={this.search.keyExtractor}
			/>
		</View>;
	}
	
	private search = {
		renderItem:   ( tz ) => {
			return <ListItem
				title={tz.item}
				onPress={() => {
					this.props.setTZ( tz.item );
					this.set.searchReset();
				}}
				containerStyle={[ color.listItem ]}
				titleStyle={[ color.foreground ]}
				rightElement={
					<Text style={[ color.foreground ]}>{this.search.getTZ( tz.item )}</Text>
				}
				bottomDivider
			/>;
		},
		keyExtractor: ( item, index ) => index.toString(),
		getTZ:        ( tz: string ) => {
			return `UTC${moment.tz( '1997-03-07 11:55', tz ).format( 'Z' )}`;
		}
	};
	
}
