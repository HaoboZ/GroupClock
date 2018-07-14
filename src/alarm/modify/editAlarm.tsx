import React from 'react';
import { Button, View } from 'react-native';
import NavComponent, { Options } from '../../extend/navComponent';
import moment, { Moment } from "moment-timezone";

import AlarmList from '../alarmList';
import AlarmItem from '../items/alarmItem';
import Label from '../components/label';
import PickTime from '../components/pickTime';
import Repeat from '../components/repeat';
import Delete from '../components/delete';

import { colors } from '../../config';
import { color, style } from '../../styles';

export default class EditAlarm extends NavComponent {
	
	public state: {
		alarm: AlarmItem,
		label: string,
		time: Moment,
		viewDate: boolean,
		repeat: Array<number>
	} = {
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
		time:     ( time: Date ) => this.setState( { time: moment( time ) } ),
		viewDate: () => this.setState( { viewDate: !this.state.viewDate } ),
		repeat:   repeat => this.setState( { repeat } )
	};
	
	constructor( props ) {
		super( props );
		this.state.alarm = this.props.navigation.getParam( 'alarm' );
		this.state.label = this.state.alarm.state.label;
		this.state.time = moment( this.state.alarm.state.time );
		this.state.repeat = AlarmItem.convert.emptyArray( this.state.alarm.state.repeat );
	}
	
	static navigationOptions( { navigation } ): Options {
		const alarm: AlarmItem = navigation.getParam( 'alarm' );
		
		return {
			title:           `Edit Alarm ${alarm.state.label !== 'Alarm' ? alarm.state.label : ''}`,
			headerBackTitle: 'Cancel',
			headerRight:     alarm.key ? <Button
				title='Save'
				onPress={() => {
					const list: AlarmList = navigation.getParam( 'list' ),
							state           = navigation.getParam( 'state' )();
					alarm.state.label = state.label;
					alarm.state.time = state.time.format( 'YYYY-MM-DD HH:mm' );
					alarm.state.repeat = AlarmItem.convert.fillArray( state.repeat );
					alarm.save().then( () => {
						list.setState( { dirty: true } );
						navigation.pop();
					} )
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
			<Delete onPress={() => this.state.alarm.delete().then( async () => {
				const list: AlarmList = this.props.navigation.getParam( 'list' );
				list.setState( { dirty: true } );
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
