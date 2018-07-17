import React from 'react';
import { Button, Group, View } from 'react-native';
import NavComponent, { Options } from '../../extend/navComponent';
import moment, { Moment } from 'moment-timezone';

import AlarmList from '../routes/alarmList';
import Item from '../item/item';
import AlarmItem from '../item/alarmItem';
import AlarmGroupItem from '../item/alarmGroupItem';

import Type from '../component/type';
import Label from '../component/label';
import PickTime from '../component/pickTime';
import Repeat from '../component/repeat';
import TimezonePicker from '../component/timezonePicker';

import { theme } from '../../config';
import { themeStyle, contentStyle } from '../../styles';

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
	
	/**
	 * Set state methods passed to components.
	 */
	private set = {
		alarmLabel: ( alarmLabel: string ) => this.setState( { alarmLabel } ),
		groupLabel: ( groupLabel: string ) => this.setState( { groupLabel } ),
		type:       ( type: number ) => {
			this.props.navigation.setParams( { title: type === itemType.Group ? ' Group' : '' } );
			this.setState( { type } );
		},
		viewPicker: () => this.setState( { viewPicker: !this.state.viewPicker } ),
		time:       ( time: Date ) => this.setState( { time: moment( time ) } ),
		repeat:     ( repeat: Array<number> ) => this.setState( { repeat } ),
		tz:         ( tz: string ) => this.setState( { tz } )
	};
	
	/**
	 * Initializes certain states that will crash if rendered.
	 *
	 * @param props
	 */
	constructor( props ) {
		super( props );
		const list: AlarmList = this.props.navigation.getParam( 'list' );
		
		// loads timezone and time that will be offset
		let tz = list.state.group.data.tz;
		Object.assign( this.state, {
			tz,
			time: moment(
				moment().tz( tz ).format( 'YYYY-MM-DD HH:mm' )
			)
		} );
	}
	
	/**
	 * @param {NavigationScreenProp<NavigationState>} navigation
	 * @returns {NavigationScreenOptions}
	 */
	static navigationOptions( { navigation } ): Options {
		const title: string = navigation.getParam( 'title', '' );
		
		let pressed = false;
		return {
			title:           `Add Alarm${title}`,
			headerBackTitle: 'Cancel',
			headerRight:     ( <Button
				title='Save'
				onPress={() => {
					// allows tapping save once only
					if ( pressed )
						return;
					pressed = true;
					
					const self: AddAlarm  = navigation.getParam( 'self' ),
							list: AlarmList = navigation.getParam( 'list' );
					
					// creates item based on type
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
					
					// adds new item to list and reloads it
					item.load.then( () => {
						list.state.group.data.items.push( item.key );
						list.state.group.save().then( () => {
								list.load().then( () => navigation.pop() );
							}
						);
					} )
				}}
				color={theme.highlight}
			/> )
		};
	}
	
	componentDidMount(): void {
		this.props.navigation.setParams( { self: this } );
	}
	
	/**
	 * @returns {JSX.Element}
	 */
	render(): JSX.Element {
		return <View
			style={[ contentStyle.flex, themeStyle.background ]}
		>
			<Type type={this.state.type} change={this.set.type}/>
			{this.type()}
		</View>;
	}
	
	/**
	 * Changes rendered element based on {@link state}.
	 *
	 * @returns {JSX.Element}
	 */
	private type: () => JSX.Element = () => {
		switch ( this.state.type ) {
		case itemType.Alarm:
			return <View>
				<Label label={this.state.alarmLabel} change={this.set.alarmLabel}/>
				<PickTime
					time={this.state.time}
					view={this.state.viewPicker}
					change={this.set.time}
					changeView={this.set.viewPicker}
				/>
				<Repeat repeat={this.state.repeat} change={this.set.repeat}/>
			</View>;
		case itemType.Group:
			return <View>
				<Label label={this.state.groupLabel} change={this.set.groupLabel}/>
				<TimezonePicker tz={this.state.tz} setTZ={this.set.tz}/>
			</View>;
		default:
			return null;
		}
	};
	
}
