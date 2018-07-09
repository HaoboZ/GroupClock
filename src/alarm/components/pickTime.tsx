import React from 'react';
import { Button, DatePickerIOS, View } from 'react-native';
import AlarmItem from '../items/alarmItem';

import { colors } from '../../config';

export default class PickTime extends React.PureComponent {
	
	props: {
		time: Date,
		view: boolean,
		change: ( string ) => void,
		changeView: () => void
	};
	
	render() {
		return <View>
			<Button
				onPress={this.props.changeView}
				title={AlarmItem.timeTo12Hour( AlarmItem.dateToTime( this.props.time ) )}
				color={colors.highlight}
			/>
			{this.props.view ? <DatePickerIOS
				date={this.props.time}
				onDateChange={this.props.change}
				mode='time'
				style={{ backgroundColor: '#ffffff' }}
			/> : null}
		</View>;
	}
	
}

