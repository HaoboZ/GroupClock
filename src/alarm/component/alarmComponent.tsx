import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import moment from 'moment-timezone';

import AlarmList from '../routes/alarmList';
import AlarmItem from '../item/alarmItem';

import { color, style } from '../../styles';

export default class AlarmComponent extends React.PureComponent {
	
	props: {
		_key: string,
		list: AlarmList,
		onPress: ( AlarmItem ) => void
	};
	
	state: {
		alarm: AlarmItem,
		active: boolean
	} = {
		alarm:  null,
		active: undefined
	};
	
	componentDidMount() {
		let alarm = new AlarmItem( this.props._key );
		alarm.load.then( () => {
			this.setState( { alarm, active: alarm.data.active } );
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
			titleStyle={[ color.foreground, styles.title ]}
			subtitle={<View style={[ style.flex, style.row, style.space ]}>
				<Text style={[ color.foreground, styles.subTitle ]}>
					{moment( this.state.alarm.data.time ).format( 'LT' )}
				</Text>
				<Text style={[ styles.subTitle ]}>{repeat}</Text>
			</View>}
			onPress={this.onPress}
			switch={{
				value:         this.state.active,
				onValueChange: this.onValueChange
			}}
		/>
	}
	
	onPress = () => this.props.onPress( this );
	
	onValueChange = ( active ) => this.setState( { active }, () => {
		this.state.alarm.activate( active ).then( async () => {
			let list = this.props.list;
			while ( list ) {
				let oldActive = list.state.group.data.active;
				let active = await list.state.group.getActive();
				if ( active === oldActive )
					return;
				
				list.state.group.data.active = active;
				list.state.group.save().then();
				if ( list.state.groupComponent )
					list.state.groupComponent.setState( { active } );
				list = list.props.navigation.getParam( 'parent', null );
			}
		} );
	} );
	
}

let styles = StyleSheet.create( {
	title:    {
		fontSize: 36
	},
	subTitle: {
		fontSize: 16
	}
} );
