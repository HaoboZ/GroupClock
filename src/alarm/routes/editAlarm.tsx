import React from 'react';
import { Button, View } from 'react-native';
import moment, { Moment } from 'moment-timezone';
import NavComponent, { Options } from '../../extend/navComponent';

import AlarmList from './alarmList';
import AlarmItem from '../item/alarmItem';

import Delete from '../component/delete';
import Label from '../component/label';
import PickTime from '../component/pickTime';
import Repeat from '../component/repeat';

import { theme } from '../../config';
import { themeStyle, contentStyle } from '../../styles';

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
	
	/**
	 * Set state methods passed to components.
	 */
	private set = {
		label:      ( label: string ) => this.setState( { label } ),
		viewPicker: () => this.setState( { viewPicker: !this.state.viewPicker } ),
		time:       ( time: Date ) => this.setState( { time: moment( time ) } ),
		repeat:     ( repeat: Array<number> ) => this.setState( { repeat } )
	};
	
	/**
	 * @param {NavigationScreenProp<NavigationState>} navigation
	 * @returns {NavigationScreenOptions}
	 */
	static navigationOptions( { navigation } ): Options {
		const self: EditAlarm = navigation.getParam( 'self' );
		if ( !self )
			return null;
		
		return {
			title:           `Edit Alarm ${self.state.label !== 'Alarm' ? self.state.label : ''}`,
			headerBackTitle: 'Cancel',
			headerRight:     ( <Button
				title='Save'
				onPress={() => {
					const list: AlarmList = navigation.getParam( 'list' );
					// move properties to alarm
					Object.assign( self.state.alarm.data, {
						label:  self.state.label,
						time:   self.state.time.format( 'YYYY-MM-DD HH:mm' ),
						repeat: AlarmItem.convert.fillArray( self.state.repeat )
					} );
					// save and reloads list
					self.state.alarm.save().then( () =>
						list.load().then( () => navigation.pop() ) );
				}}
				color={theme.highlight}
			/> )
		};
	}
	
	componentDidMount(): void {
		const alarm: AlarmItem = this.props.navigation.getParam( 'alarm' );
		// converts to correct format
		this.setState( {
			alarm,
			label:  alarm.data.label,
			time:   moment( alarm.data.time ),
			repeat: AlarmItem.convert.emptyArray( alarm.data.repeat )
		}, () => this.props.navigation.setParams( { self: this } ) );
		
	}
	
	/**
	 * @returns {JSX.Element}
	 */
	render(): JSX.Element {
		if ( !this.state.alarm )
			return null;
		
		return <View style={[ contentStyle.flex, themeStyle.background ]}>
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
	
	/**
	 * Delete this alarm from list.
	 *
	 * @returns {Promise<void>}
	 */
	delete = () => this.state.alarm.delete().then( () => {
		const list: AlarmList = this.props.navigation.getParam( 'list' );
		// removes from list
		let items = list.state.group.data.items;
		items.splice( items.indexOf( this.state.alarm.key ), 1 );
		// reloads list
		list.state.group.save().then( () =>
			list.load().then( () => this.props.navigation.pop() )
		);
	} )
	
}
