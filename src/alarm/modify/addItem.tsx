import React from 'react';
import { Button, Group, View } from 'react-native';
import NavComponent, { Options } from '../../extend/navComponent';
import * as moment from 'moment-timezone';

import { AlarmList } from '../alarmList';
import TimezonePicker from '../../components/timezonePicker';
import Label from '../components/label';
import Type from '../components/type';
import PickTime from '../components/pickTime';
import Repeat from '../components/repeat';

import { colors } from '../../config';
import { color, style } from '../../styles';

export const itemType = {
	Alarm: 0,
	Group: 1
};

export default class AddItem extends NavComponent {
	
	public state = {
		alarmLabel: 'Alarm',
		groupLabel: 'Group',
		type:       itemType.Alarm,
		time:       null,
		viewDate:   false,
		repeat:     [],
		tz:         '',
		tzOffset:   0
	};
	
	/**
	 * Set state functions.
	 */
	private set = {
		alarmLabel: alarmLabel => this.setState( { alarmLabel } ),
		groupLabel: groupLabel => this.setState( { groupLabel } ),
		type:       type => {
			this.props.navigation.setParams( { title: type === itemType.Group ? ' Group' : '' } );
			this.setState( { type } );
		},
		time:       time => this.setState( { time } ),
		viewDate:   () => this.setState( { viewDate: !this.state.viewDate } ),
		repeat:     repeat => this.setState( { repeat } ),
		tz:         tz => this.setState( { tz } )
	};
	
	/**
	 * Initializes timezone and time.
	 *
	 * @param props
	 */
	constructor( props ) {
		super( props );
		const list: AlarmList = this.props.navigation.getParam( 'list' );
		
		// Loads timezone
		this.state.tz = list.state.group.state.tz;
		// calculates timezone 1 time so that tz will be used for new group
		this.state.tzOffset = moment.tz.zone( this.state.tz ).utcOffset( Date.now() );
		
		// Loads time that will be changed to timezone
		let time = new Date( Date.now() );
		time.setTime( time.getTime() + ( time.getTimezoneOffset() - this.state.tzOffset + 1 ) * 60 * 1000 );
		this.state.time = time;
	}
	
	/**
	 * @param {NavigationScreenProp<NavigationState>} navigation
	 * @navParam parent
	 * @returns {NavigationScreenOptions}
	 */
	static navigationOptions( { navigation } ): Options {
		const title           = navigation.getParam( 'title', '' ),
				list: AlarmList = navigation.getParam( 'list' );
		let parentKey = list.state.group.key;
		
		let canClick = true;
		return {
			title:           `Add Alarm${title}`,
			headerBackTitle: 'Cancel',
			headerRight:     parentKey ? <Button
				title='Save'
				onPress={() => {
					if ( !canClick )
						return;
					canClick = false;
					
					const state = navigation.getParam( 'state' )();
					list.addNew( state ).then( () => navigation.pop() );
				}}
				color={colors.highlight}
			/> : null
		};
	}
	
	componentDidMount(): void {
		this.props.navigation.setParams( { state: () => this.state } );
	}
	
	render(): JSX.Element {
		return <View
			style={[ style.flex, color.background ]}
		>
			<Type type={this.state.type} change={this.set.type}/>
			{this.type()}
		</View>;
	}
	
	/**
	 * Changes components based on the type that is selected.
	 * @returns {any}
	 */
	private type = () => {
		if ( this.state.type === itemType.Alarm ) {
			return <View>
				<Label label={this.state.alarmLabel} change={this.set.alarmLabel}/>
				<PickTime
					time={this.state.time}
					view={this.state.viewDate}
					change={this.set.time}
					changeView={this.set.viewDate}
				/>
				<Repeat repeat={this.state.repeat} change={this.set.repeat}/>
			</View>
		} else {
			return <View>
				<Label label={this.state.groupLabel} change={this.set.groupLabel}/>
				<TimezonePicker tz={this.state.tz} setTZ={this.set.tz}/>
			</View>;
		}
	};
	
}
