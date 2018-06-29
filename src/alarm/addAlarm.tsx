import React from 'react';
import { Button, DatePickerIOS, ScrollView, StyleSheet, View } from 'react-native';
import { ButtonGroup, Input, ListItem } from 'react-native-elements';
import moment from 'moment-timezone';
import TimezonePicker from '../components/timezonePicker';

import { colors } from '../config';
import { color, style } from '../styles';
import NavComponent from "../components/navComponent";

export default class AddAlarm extends NavComponent {
	
	//TODO: Input timezone from group instead
	
	public state = {
		label:      'Alarm',
		type:       0,
		changeDate: false,
		date:       null,
		repeat:     [],
		tz:         '',
		tzoffset:   0,
		groupTZ:    ''
	};
	
	private set = {
		label:      label => this.setState( { label } ),
		type:       type => {
			this.props.navigation.setParams( { title: type ? ' Group' : '' } );
			this.setState( { type } )
		},
		changeDate: () => this.setState( { changeDate: !this.state.changeDate } ),
		date:       date => this.setState( { date } ),
		repeat:     repeat => this.setState( { repeat } ),
		groupTZ:    groupTZ => this.setState( { groupTZ } )
	};
	
	constructor( props ) {
		super( props );
		
		this.state.groupTZ = this.state.tz = this.props.navigation.getParam( 'tz' );
		this.state.tzoffset = moment.tz.zone( this.state.tz ).utcOffset( Date.now() );
		
		let date = new Date( Date.now() );
		date.setTime( date.getTime() + ( date.getTimezoneOffset() - this.state.tzoffset + 1 ) * 60 * 1000 );
		this.state.date = date;
	}
	
	static navigationOptions( { navigation } ) {
		let title = navigation.getParam( 'title', '' );
		
		return {
			title:           'Add Alarm' + title,
			headerBackTitle: 'Cancel',
			headerRight:     <Button
									  title='Save'
									  onPress={() => {
										  //TODO: Verify some info
										  //TODO: Save to data
										  navigation.goBack();
									  }}
									  color={colors.highlight}
								  />
		};
	}
	
	render() {
		return <ScrollView
			style={[ style.flex, color.background ]}
		>
			{this.label()}
			{this.typeSelect()}
			{this.type()}
		</ScrollView>;
	}
	
	protected type = () => {
		if ( !this.state.type ) {
			return <View>
				{this.pickDate()}
				{this.repeat()}
			</View>
		} else {
			return <View>
				<TimezonePicker tz={this.state.groupTZ} setTZ={this.set.groupTZ}/>
			</View>;
		}
	};
	
	protected label() {
		return <ListItem
			containerStyle={[ styles.Item ]}
			title='Label'
			titleStyle={[ color.foreground ]}
			rightElement={<Input
				containerStyle={[ color.background, styles.rightItem ]}
				inputStyle={[ color.foreground ]}
				onChangeText={this.set.label}
				value={this.state.label}
				maxLength={16}
			/>}
		/>;
	};
	
	protected typeSelect() {
		return <View
			style={[ styles.Item, style.center ]}
		>
			<ButtonGroup
				buttons={[ 'Alarm', 'Group' ]}
				selectedIndex={this.state.type}
				onPress={this.set.type}
				containerStyle={[ color.background, styles.rightItem ]}
				selectedButtonStyle={{ backgroundColor: '#ffffff' }}
				selectedTextStyle={{ color: '#000000' }}
				textStyle={[ color.foreground, { fontSize: 14 } ]}
			/>
		</View>;
	}
	
	protected pickDate() {
		return <View>
			<Button
				onPress={this.set.changeDate}
				title={this.state.date.toTimeString()}
				color={colors.highlight}
			/>
			{this.state.changeDate ? <DatePickerIOS
				date={this.state.date}
				onDateChange={this.set.date}
				mode='time'
				style={{ backgroundColor: '#ffffff' }}
			/> : null}
		</View>
	};
	
	protected repeat() {
		return <ListItem
			containerStyle={[ styles.Item, {
				paddingRight: 0
			} ]}
			title='Repeat'
			titleStyle={[ color.foreground ]}
			rightElement={<ButtonGroup
				buttons={[ 'Su', 'M', 'Tu', 'W', 'Th', 'F', 'Sa' ]}
				selectMultiple
				selectedIndex={null}
				selectedIndexes={this.state.repeat}
				onPress={this.set.repeat}
				containerStyle={[ color.background, styles.rightItem ]}
				textStyle={[ color.foreground ]}
				selectedButtonStyle={{ backgroundColor: colors.foreground }}
				selectedTextStyle={{ color: colors.background }}
			/>}
		/>;
	}
	
}

const styles = StyleSheet.create(
	{
		Item:      {
			height:          65,
			paddingTop:      0,
			paddingBottom:   0,
			paddingLeft:     20,
			paddingRight:    20,
			backgroundColor: colors.background
		},
		rightItem: {
			width:  210,
			margin: 0
		}
	}
);
