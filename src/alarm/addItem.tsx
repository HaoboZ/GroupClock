import React from 'react';
import { Button, Group, ScrollView, View } from 'react-native';
import NavComponent from '../components/navComponent';
import * as moment from 'moment-timezone';
import TimezonePicker from '../components/timezonePicker';

import AlarmItem from './items/alarmItem';
import GroupItem from './items/groupItem';
import Label from './components/label';
import Type from './components/type';
import PickTime from './components/pickTime';
import Repeat from './components/repeat';

import { colors } from '../config';
import { color, style } from '../styles';

const itemType = {
	Alarm: 0,
	Group: 1
};

export default class AddItem extends NavComponent {
	
	public state = {
		label:    'Alarm',
		type:     itemType.Alarm,
		viewDate: false,
		time:     null,
		repeat:   [],
		tz:       '',
		tzOffset: 0
	};
	
	/**
	 * Set state functions.
	 */
	private set = {
		label:    label => this.setState( { label } ),
		type:     type => {
			this.props.navigation.setParams( { title: type === itemType.Group ? ' Group' : '' } );
			this.setState( { type } );
		},
		viewDate: () => this.setState( { viewDate: !this.state.viewDate } ),
		time:     time => this.setState( { time } ),
		repeat:   repeat => {
			this.setState( { repeat } )
		},
		tz:       tz => this.setState( { tz } )
	};
	
	/**
	 * Initializes timezone and time.
	 *
	 * @param props
	 */
	constructor( props ) {
		super( props );
		// Loads timezone
		this.state.tz = this.props.navigation.getParam( 'tz' );
		// calculates timezone 1 time so that tz will be used for new group
		this.state.tzOffset = moment.tz.zone( this.state.tz ).utcOffset( Date.now() );
		
		// Loads time that will be changed to timezone
		let time = new Date( Date.now() );
		time.setTime( time.getTime() + ( time.getTimezoneOffset() - this.state.tzOffset + 1 ) * 60 * 1000 );
		this.state.time = time;
	}
	
	/**
	 *
	 * @param {NavigationScreenProp<NavigationState>} navigation
	 * @navParam tz
	 * @navParam key
	 * @navParam reload
	 * @returns {{title: string, headerBackTitle: string, headerRight: null}}
	 */
	static navigationOptions( { navigation } ) {
		let title     = navigation.getParam( 'title', '' ),
			 parentKey = navigation.getParam( 'key' );
		
		if ( !parentKey )
			alert( 'An error has occurred' );
		
		return {
			title:           'Add Alarm' + title,
			headerBackTitle: 'Cancel',
			headerRight:     parentKey ? <Button
				title='Save'
				onPress={() => {
					const reload = navigation.getParam( 'reload' ),
							state  = navigation.getParam( 'state' )();
					AddItem.saveData( state, parentKey ).then( () => {
						reload();
						navigation.goBack();
					} )
				}}
				color={colors.highlight}
			/> : null
		};
	}
	
	/**
	 * Creates a new item and adds it to parent.
	 *
	 * @param state
	 * @param {string} parentKey
	 * @returns {Promise<void>}
	 */
	private static async saveData( state: any, parentKey: string ) {
		let item: AlarmItem | GroupItem;
		
		if ( state.type === itemType.Alarm ) {
			item = await AlarmItem.create(
				null,
				state.label,
				AlarmItem.dateToTime( state.time ),
				AlarmItem.fillArray( state.repeat )
			);
		} else {
			item = await GroupItem.create(
				null,
				state.label,
				state.tz,
				[]
			);
		}
		
		// Retrieves parent info from storage
		let parent = new GroupItem( { k: parentKey } );
		await parent.load( true );
		// adds key to items
		parent.state.items.push( item.key );
		await parent.save().catch( () => alert( 'An error has occurred' ) );
	}
	
	componentDidMount() {
		this.props.navigation.setParams( { state: () => this.state } );
	}
	
	render() {
		return <ScrollView
			style={[ style.flex, color.background ]}
		>
			<Label label={this.state.label} change={this.set.label}/>
			<Type type={this.state.type} change={this.set.type}/>
			{this.type()}
		</ScrollView>;
	}
	
	/**
	 * Changes components based on the type that is selected.
	 * @returns {any}
	 */
	private type = () => {
		if ( this.state.type == itemType.Alarm ) {
			return <View>
				<PickTime
					time={this.state.time}
					view={this.state.viewDate}
					change={this.set.time}
					changeView={this.set.viewDate}
				/>
				<Repeat repeat={this.state.repeat} change={this.set.repeat}/>
			</View>
		} else {
			return <TimezonePicker tz={this.state.tz} setTZ={this.set.tz}/>;
		}
	};
	
}
