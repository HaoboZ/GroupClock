import React from 'react';
import { Button, Group, View } from 'react-native';
import NavComponent, { Options } from '../../extend/navComponent';
import moment, { Moment } from 'moment-timezone';

import AlarmList from '../alarmList';
import TimezonePicker from '../components/timezonePicker';
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
	
	public state: {
		alarmLabel: string,
		groupLabel: string,
		type: number,
		time: Moment,
		viewDate: boolean,
		repeat: Array<number>,
		tz: string
	} = {
		alarmLabel: 'Alarm',
		groupLabel: 'Group',
		type:       itemType.Alarm,
		time:       null,
		viewDate:   false,
		repeat:     [],
		tz:         ''
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
		time:       ( time: Date ) => this.setState( { time: moment( time ) } ),
		viewDate:   () => this.setState( { viewPicker: !this.state.viewDate } ),
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
		
		// Loads timezone and time that will be offset
		this.state.tz = list.state.group.state.tz;
		this.state.time = moment( moment().tz( this.state.tz ).format( 'YYYY-MM-DD HH:mm' ) );
	}
	
	/**
	 * @param {NavigationScreenProp<NavigationState>} navigation
	 * @navParam parent
	 * @returns {NavigationScreenOptions}
	 */
	static navigationOptions( { navigation } ): Options {
		const title           = navigation.getParam( 'title', '' ),
				list: AlarmList = navigation.getParam( 'list' );
		
		let canClick = true;
		return {
			title:           `Add Alarm${title}`,
			headerBackTitle: 'Cancel',
			headerRight:     list.state.group.key ? <Button
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
