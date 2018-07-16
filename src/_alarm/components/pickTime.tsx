import React from 'react';
import { Button, DatePickerIOS, View } from 'react-native';
import { Moment } from "moment-timezone";

import { colors } from '../../config';

export default class PickTime extends React.PureComponent {
	
	props: {
		time: Moment,
		view: boolean,
		change: ( string ) => void,
		changeView: () => void
	};
	
	render(): JSX.Element {
		return <View>
			<Button
				onPress={this.props.changeView}
				title={this.props.time.format( 'LT' )}
				color={colors.highlight}
			/>
			{this.props.view ? <DatePickerIOS
				date={this.props.time.toDate()}
				onDateChange={this.props.change}
				mode='time'
				style={{ backgroundColor: '#ffffff' }}
			/> : null}
		</View>;
	}
	
}
