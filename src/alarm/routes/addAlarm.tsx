import React from 'react';
import { Button, Group, View } from 'react-native';
import moment, { Moment } from 'moment-timezone';
import NavComponent, { Options } from '../../extend/navComponent';

import AlarmList from '../routes/alarmList';
import AlarmItem from '../item/alarmItem';

import Type from '../component/type';
import Label from '../component/label';
import PickTime from '../component/pickTime';
import Repeat from '../component/repeat';
import TimezonePicker from '../component/timezonePicker';

import { colors } from '../../config';
import { color, style } from '../../styles';
import AlarmGroupItem from '../item/alarmGroupItem';
import Item from '../item/item';

export const itemType = {
	Alarm: 0,
	Group: 1
};

export default class AddAlarm extends NavComponent {
	
	public state: {
		alarmLabel: string,
		groupLabel: string,
		type: number,
		viewPicker: boolean,
		time: Moment,
		repeat: Array<number>,
		tz: string
	} = {
		alarmLabel: 'Alarm',
		groupLabel: 'Group',
		type:       itemType.Alarm,
		viewPicker: false,
		time:       null,
		repeat:     [],
		tz:         ''
	};
	
	private set = {
		alarmLabel: alarmLabel => this.setState( { alarmLabel } ),
		groupLabel: groupLabel => this.setState( { groupLabel } ),
		type:       type => {
			this.props.navigation.setParams( { title: type === itemType.Group ? ' Group' : '' } );
			this.setState( { type } );
		},
		viewPicker: () => this.setState( { viewPicker: !this.state.viewPicker } ),
		time:       ( time: Date ) => this.setState( { time: moment( time ) } ),
		repeat:     repeat => this.setState( { repeat } ),
		tz:         tz => this.setState( { tz } )
	};
	
	constructor( props ) {
		super( props );
		const list: AlarmList = this.props.navigation.getParam( 'list' );
		
		// Loads timezone and time that will be offset
		this.state.tz = list.state.group.data.tz;
		this.state.time = moment(
			moment().tz( this.state.tz ).format( 'YYYY-MM-DD HH:mm' )
		);
	}
	
	static navigationOptions( { navigation } ): Options {
		const title: string   = navigation.getParam( 'title', '' ),
				self: AddAlarm  = navigation.getParam( 'self' ),
				list: AlarmList = navigation.getParam( 'list' );
		
		let clicked = false;
		return {
			title:           `Add Alarm${title}`,
			headerBackTitle: 'Cancel',
			headerRight:     ( <Button
				title='Save'
				onPress={() => {
					if ( clicked )
						return;
					clicked = true;
					
					let item: Item<any>;
					switch ( self.state.type ) {
					case itemType.Alarm:
						item = new AlarmItem();
						item.create( {
							type:   'alarm',
							parent: list.state.group.key,
							label:  self.state.alarmLabel,
							time:   self.state.time.format( 'YYYY-MM-DD HH:mm' ),
							repeat: AlarmItem.convert.fillArray( self.state.repeat ),
							active: false,
							update: moment().unix()
						} ).then();
						break;
					case itemType.Group:
						item = new AlarmGroupItem();
						item.create( {
							type:   'group',
							parent: list.state.group.key,
							label:  self.state.groupLabel,
							tz:     self.state.tz,
							items:  [],
							active: 0
						} ).then();
						break;
					default:
						alert( '????' );
						return;
					}
					
					item.load.then( () => {
						list.state.group.data.items.push( item.key );
						list.state.group.save().then( () => {
								list.load().then();
								navigation.pop();
							}
						);
					} )
				}}
				color={colors.highlight}
			/> )
		};
	}
	
	componentDidMount() {
		this.props.navigation.setParams( { self: this } );
	}
	
	render(): JSX.Element {
		return <View
			style={[ style.flex, color.background ]}
		>
			<Type type={this.state.type} change={this.set.type}/>
			{this.type()}
		</View>;
	}
	
	private type = () => {
		if ( this.state.type === itemType.Alarm ) {
			return <View>
				<Label label={this.state.alarmLabel} change={this.set.alarmLabel}/>
				<PickTime
					time={this.state.time}
					view={this.state.viewPicker}
					change={this.set.time}
					changeView={this.set.viewPicker}
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
