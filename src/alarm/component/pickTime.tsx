import React from 'react';
import { Button, DatePickerIOS, StyleSheet, View } from 'react-native';
import { Moment } from 'moment-timezone';

import { theme } from '../../config';

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
				color={theme.highlight}
			/>
			{this.props.view ? <DatePickerIOS
				date={this.props.time.toDate()}
				onDateChange={this.props.change}
				mode='time'
				style={[ style.picker ]}
			/> : null}
		</View>;
	}
	
}

const style = StyleSheet.create( {
	picker: { backgroundColor: theme.foreground }
} );
