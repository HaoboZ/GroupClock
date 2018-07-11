import React from 'react';
import { Button, View } from 'react-native';
import NavComponent from '../../extend/navComponent';

import AlarmItem from '../items/alarmItem';
import Label from '../components/label';
import PickTime from '../components/pickTime';
import Repeat from '../components/repeat';
import Delete from '../components/delete';

import { colors } from '../../config';
import { color, style } from '../../styles';
import { AlarmList } from '../alarmList';

export default class EditAlarm extends NavComponent {
	
	public state: { alarm: AlarmItem, label: string, time: Date, viewDate: boolean, repeat: Array<number> } = {
		alarm:    null,
		label:    '',
		time:     null,
		viewDate: false,
		repeat:   []
	};
	
	/**
	 * Set state functions.
	 */
	private set = {
		label:    label => this.setState( { label } ),
		time:     time => this.setState( { time } ),
		viewDate: () => this.setState( { viewDate: !this.state.viewDate } ),
		repeat:   repeat => this.setState( { repeat } )
	};
	
	constructor( props ) {
		super( props );
		this.state.alarm = this.props.navigation.getParam( 'alarm' );
		this.state.label = this.state.alarm.state.label;
		this.state.time = new Date( `07 Mar 1997 ${this.state.alarm.state.time}:00` );
		this.state.repeat = AlarmItem.emptyArray( this.state.alarm.state.repeat );
	}
	
	static navigationOptions( { navigation } ) {
		const alarm: AlarmItem = navigation.getParam( 'alarm' );
		if ( !alarm )
			alert( 'An error has occurred' );
		
		return {
			title:           `Edit Alarm ${alarm.state.label}`,
			headerBackTitle: 'Cancel',
			headerRight:     alarm.key ? <Button
				title='Save'
				onPress={() => {
					const parent: AlarmList = navigation.getParam( 'parent' ),
							state             = navigation.getParam( 'state' )();
					alarm.state.label = state.label;
					alarm.state.time = AlarmItem.dateToTime( state.time );
					alarm.state.repeat = AlarmItem.fillArray( state.repeat );
					alarm.save().then( () => {
						parent.setState( { dirty: true } );
						navigation.pop();
					} )
				}}
				color={colors.highlight}
			/> : null
		};
	}
	
	componentDidMount() {
		this.props.navigation.setParams( { state: () => this.state } );
	}
	
	render() {
		return <View
			style={[ style.flex, color.background ]}
		>
			<Delete onPress={() => this.state.alarm.delete().then( () => {
				const parent: AlarmList = this.props.navigation.getParam( 'parent' );
				parent.setState( { dirty: true } );
				this.props.navigation.pop();
			} )}/>
			<Label label={this.state.label} change={this.set.label}/>
			<PickTime
				time={this.state.time}
				view={this.state.viewDate}
				change={this.set.time}
				changeView={this.set.viewDate}
			/>
			<Repeat repeat={this.state.repeat} change={this.set.repeat}/>
		</View>;
	}
	
}
