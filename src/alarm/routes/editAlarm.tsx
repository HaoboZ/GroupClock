import React from 'react';
import { Button, View } from 'react-native';
import moment, { Moment } from 'moment-timezone';
import NavComponent, { Options } from '../../extend/navComponent';

import AlarmList from './alarmList';
import AlarmItem from '../item/alarmItem';

import { colors } from '../../config';
import { color, style } from '../../styles';
import Delete from '../component/delete';
import Label from '../component/label';
import PickTime from '../component/pickTime';
import Repeat from '../component/repeat';

export default class EditAlarm extends NavComponent {
	
	public state: {
		alarm: AlarmItem,
		label: string,
		time: Moment,
		viewPicker: boolean,
		repeat: Array<number>
	} = {
		alarm:      null,
		viewPicker: false,
		label:      undefined,
		time:       undefined,
		repeat:     undefined
	};
	
	private set = {
		label:      label => this.setState( { label } ),
		viewPicker: () => this.setState( { viewPicker: !this.state.viewPicker } ),
		time:       ( time: Date ) => this.setState( { time: moment( time ) } ),
		repeat:     repeat => this.setState( { repeat } )
	};
	
	static navigationOptions( { navigation } ): Options {
		const list: AlarmList = navigation.getParam( 'list' );
		const self: EditAlarm = navigation.getParam( 'self' );
		if ( !self )
			return null;
		
		return {
			title:           `Edit Alarm ${self.state.label !== 'Alarm' ? self.state.label : ''}`,
			headerBackTitle: 'Cancel',
			headerRight:     ( <Button
				title='Save'
				onPress={() => {
					self.state.alarm.data.label = self.state.label;
					self.state.alarm.data.time = self.state.time.format( 'YYYY-MM-DD HH:mm' );
					self.state.alarm.data.repeat = AlarmItem.convert.fillArray( self.state.repeat );
					self.state.alarm.save().then( () => {
						list.load().then();
						navigation.pop();
					} );
				}}
				color={colors.highlight}
			/> )
		};
	}
	
	componentDidMount() {
		const alarm: AlarmItem = this.props.navigation.getParam( 'alarm' );
		this.setState( {
			alarm,
			label:  alarm.data.label,
			time:   moment( alarm.data.time ),
			repeat: AlarmItem.convert.emptyArray( alarm.data.repeat )
		} );
		
		this.props.navigation.setParams( { self: this } );
	}
	
	render(): JSX.Element {
		return <View style={[ style.flex, color.background ]}>
			<Delete onPress={this.delete}/>
			<Label label={this.state.label} change={this.set.label}/>
			<PickTime
				time={this.state.time}
				view={this.state.viewPicker}
				change={this.set.time}
				changeView={this.set.viewPicker}
			/>
			<Repeat repeat={this.state.repeat} change={this.set.repeat}/>
		</View>;
	}
	
	delete = () => this.state.alarm.delete().then( () => {
		const list: AlarmList = this.props.navigation.getParam( 'list' );
		let items = list.state.group.data.items;
		items.splice( items.indexOf( this.state.alarm.key ), 1 );
		list.state.group.save().then( () =>
			list.load().then()
		);
		this.props.navigation.pop();
	} )
	
}