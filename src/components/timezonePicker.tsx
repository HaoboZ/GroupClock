import React from 'react';
import { FlatList, Text, View } from 'react-native';
import { ListItem, SearchBar } from 'react-native-elements';
import moment from 'moment-timezone';

import config, { colors } from '../config';

export default class TimezonePicker extends React.PureComponent {
	
	props: {
		tz,
		changeTZ
	};
	
	state = {
		text:          '',
		searchTimeout: 0,
		searchTZ:      []
	};
	
	private tzs: Array<string> = moment.tz.names();
	
	private setText = text => {
		if (this.state.searchTimeout)
			clearTimeout( this.state.searchTimeout );
		
		this.setState(
			{
				searchTimeout: setTimeout( () => {
					let searchTZ = [];
					if (text.length) {
						searchTZ =
							this.tzs
								 .map( tz => tz.includes( text ) ? tz : null )
								 .filter( tz => tz != null )
								 .slice( 0, 10 );
					}
					this.setState( { text, searchTZ } );
				}, 250 )
			}
		);
	};
	
	render() {
		return <View>
			<Text style={[ config.colors.text, {
				fontSize:    18,
				paddingLeft: 10,
				height:      36
			} ]}>{this.props.tz}</Text>
			<SearchBar
				platform="ios"
				onChangeText={this.setText}
				clearIcon={null}
				clearButtonMode='always'
				cancelButtonTitle=''
				value={this.state.text}
				containerStyle={[ config.colors.background ]}
				inputContainerStyle={[ config.colors.navigation ]}
				inputStyle={[ config.colors.text ]}
				placeholder='Search'
				placeholderTextColor={colors.item}
			/>
			<FlatList
				renderItem={this.renderItem}
				data={this.state.searchTZ}
				keyExtractor={this.keyExtractor}
			/>
		</View>;
	}
	
	private renderItem = ( tz ) => {
		return <ListItem
			title={tz.item}
			onPress={() => this.props.changeTZ( tz.item )}
			containerStyle={[ config.colors.item, { borderBottomWidth: 0.5 } ]}
			titleStyle={[ config.colors.text ]}
			rightElement={
				<Text style={[ config.colors.text ]}>{'UTC' + moment.tz( "2013-11-18 11:55", tz.item ).format( 'Z' )}</Text>}
		/>;
	};
	
	private keyExtractor = ( item, index ) => {
		return index.toString();
	};
	
}
