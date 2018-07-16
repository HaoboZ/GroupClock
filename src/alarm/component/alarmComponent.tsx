import React from 'react';
import { Text, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import moment from 'moment-timezone';

import AlarmList from '../routes/alarmList';
import AlarmItem from '../item/alarmItem';

import { color, style } from '../../styles';

export default class AlarmComponent extends React.PureComponent {
	
	props: {
		_key: string,
		list: AlarmList,
		onPress: ( AlarmComponent ) => void
	};
	
	state: {
		alarm: AlarmItem
	} = {
		alarm: null
	};
	
	componentDidMount() {
		let alarm = new AlarmItem( this.props._key );
		alarm.load.then( () => {
			this.setState( { alarm } );
		} );
	}
	
	render() {
		if ( !this.state.alarm )
			return null;
		
		const days = 'SMTWTFS';
		let repeat = [];
		for ( let i = 0; i < 7; ++i ) {
			repeat[ i ] = <Text key={i} style={[
				this.state.alarm.data.repeat[ i ] ? color.highlight : color.foreground
			]}> {days[ i ]}</Text>;
		}
		return <ListItem
			containerStyle={[ color.listItem ]}
			topDivider
			bottomDivider
			title={this.state.alarm.data.label}
			titleStyle={[ color.foreground, { fontSize: 36 } ]}
			subtitle={<View style={[ style.flex, style.row, style.space ]}>
				<Text style={[ color.foreground, { fontSize: 16 } ]}>
					{moment( this.state.alarm.data.time ).format( 'LT' )}
				</Text>
				<Text style={{ fontSize: 16 }}>{repeat}</Text>
			</View>}
			onPress={this.onPress}
			switch={{
				value:         this.state.alarm.data.active,
				onValueChange: ( active ) => {
					this.setState( { active }, () => {
						this.state.alarm.save().then( () => {
							// reset list
						} );
					} );
				}
			}}
		/>
	}
	
	onPress = () => this.props.onPress( this );
	
}