import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';
import moment from 'moment-timezone';

import { theme } from '../../config';
import { themeStyle, contentStyle } from '../../styles';

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
		text:        ( text: string ) => {
			if ( this.state.timeout )
				clearTimeout( this.state.timeout );
			
			this.setState( {
				timeout: setTimeout( () => {
					// updates search results after a timeout
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
	
	private tzs = moment.tz.names();
	
	/**
	 * @returns {JSX.Element}
	 */
	render(): JSX.Element {
		console.log( this.state.searchTZ.length );
		return <View style={[ contentStyle.flex ]}>
			{this.state.searchTZ.length ? null : <ListItem
				containerStyle={[ themeStyle.background ]}
				titleStyle={[ themeStyle.foreground ]}
				title={this.props.tz}
				rightElement={<Text style={[ themeStyle.foreground ]}>
					{this.helper.getTZ( this.props.tz )}
				</Text>}
			/>}
			<SearchBar
				platform='ios'
				onChangeText={this.set.text}
				clearIcon={null}
				clearButtonMode='always'
				cancelButtonTitle=''
				value={this.state.text}
				keyboardAppearance='dark'
				containerStyle={[ themeStyle.background ]}
				inputContainerStyle={[ themeStyle.navigation ]}
				inputStyle={[ themeStyle.foreground ]}
				placeholder='Search'
				placeholderTextColor={theme.contrast}
			/>
			<FlatList
				renderItem={this.helper.renderItem}
				data={this.state.searchTZ}
				keyExtractor={this.helper.keyExtractor}
			/>
		</View>;
	}
	
	private helper = {
		renderItem:   ( tz ) => {
			return <ListItem
				title={tz.item}
				onPress={() => {
					this.props.setTZ( tz.item );
					this.set.searchReset();
				}}
				containerStyle={[ themeStyle.listItem ]}
				titleStyle={[ themeStyle.foreground ]}
				rightElement={<Text
					style={[ themeStyle.foreground ]}>{this.helper.getTZ( tz.item )}
				</Text>}
				bottomDivider
			/>;
		},
		keyExtractor: ( item, index ) => index.toString(),
		getTZ:        ( tz: string ) => {
			return `UTC${moment().tz( tz ).format( 'Z' )}`;
		}
	};
	
}
