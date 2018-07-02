import React from 'react';
import { colors } from '../../config';
import { Button, DatePickerIOS, View } from 'react-native';

export default class PickDate extends React.PureComponent {
	
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
				title={this.props.time.toTimeString()}
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

