import React from 'react';
import { Button, Group, View } from 'react-native';
import NavComponent from '../../extend/navComponent';
import * as moment from 'moment-timezone';
import TimezonePicker from '../../components/timezonePicker';

import GroupItem from '../items/groupItem';
import Label from '../components/label';
import Type from '../components/type';
import PickTime from '../components/pickTime';
import Repeat from '../components/repeat';

import { colors } from '../../config';
import { color, style } from '../../styles';
import { itemType, save } from '../items/item';

export default class AddItem extends NavComponent {
	
	public state = {
		label:    'Alarm',
		type:     itemType.Alarm,
		time:     null,
		viewDate: false,
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
		time:     time => this.setState( { time } ),
		viewDate: () => this.setState( { viewDate: !this.state.viewDate } ),
		repeat:   repeat => this.setState( { repeat } ),
		tz:       tz => this.setState( { tz } )
	};
	
	/**
	 * Initializes timezone and time.
	 *
	 * @param props
	 */
	constructor( props ) {
		super( props );
		const group: GroupItem = this.props.navigation.getParam( 'group' );
		// Loads timezone
		this.state.tz = group.state.tz;
		// calculates timezone 1 time so that tz will be used for new group
		this.state.tzOffset = moment.tz.zone( this.state.tz ).utcOffset( Date.now() );
		
		// Loads time that will be changed to timezone
		let time = new Date( Date.now() );
		time.setTime( time.getTime() + ( time.getTimezoneOffset() - this.state.tzOffset + 1 ) * 60 * 1000 );
		this.state.time = time;
	}
	
	/**
	 * @param {NavigationScreenProp<NavigationState>} navigation
	 * @navParam tz
	 * @navParam key
	 * @navParam reload
	 * @returns {{title: string, headerBackTitle: string, headerRight: null}}
	 */
	static navigationOptions( { navigation } ) {
		const title            = navigation.getParam( 'title', '' ),
				group: GroupItem = navigation.getParam( 'group' );
		if ( !group )
			alert( 'An error has occurred' );
		let parentKey = group.key;
		
		return {
			title:           `Add Alarm${title}`,
			headerBackTitle: 'Cancel',
			headerRight:     parentKey ? <Button
				title='Save'
				onPress={() => {
					const reload = navigation.getParam( 'reload' ),
							state  = navigation.getParam( 'state' )();
					save( state, parentKey ).then( () => {
						reload();
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
			<Label label={this.state.label} change={this.set.label}/>
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
