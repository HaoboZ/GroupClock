import React from 'react';
import { AsyncStorage, Button, ScrollView, View } from 'react-native';
import NavComponent from '../components/navComponent';
import * as moment from 'moment-timezone';
import TimezonePicker from '../components/timezonePicker';
import Label from './components/label';
import Type from './components/type';
import PickDate from './components/pickDate';
import Repeat from './components/repeat';
import Storage from '../extend/storage';

import { colors } from '../config';
import { color, style } from '../styles';

export default class AddAlarm extends NavComponent {
	
	public state = {
		label:    'Alarm',
		type:     0,
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
			this.props.navigation.setParams( { title: type == 'Group' ? ' Group' : '' } );
			this.setState( { type } )
		},
		viewDate: () => this.setState( { viewDate: !this.state.viewDate } ),
		time:     time => this.setState( { time } ),
		repeat:   repeat => {
			console.log( repeat );
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
		this.state.tzOffset = moment.tz.zone( this.state.tz ).utcOffset( Date.now() );
		
		// Loads time that will be changed to timezone
		let time = new Date( Date.now() );
		time.setTime( time.getTime() + ( time.getTimezoneOffset() - this.state.tzOffset + 1 ) * 60 * 1000 );
		this.state.time = time;
	}
	
	static navigationOptions( { navigation } ) {
		let state     = navigation.getParam( 'state' ),
			 title     = navigation.getParam( 'title', '' ),
			 parentKey = navigation.getParam( 'key' );
		
		const save = async () => {
			// generate random key
			let key = Math.random().toString( 36 ).substring( 2, 12 );
			// Stores new alarm
			let data: any = {};
			data.label = state.label;
			if ( state.type == 'Group' ) {
				data.type = 1;
				data.tz = state.tz;
			} else {
				data.type = 0;
				data.time = state.time;
				data.repeat = state.repeat;
			}
			await Storage.setItem( key, data );
			
			// Retrieves parent info from storage
			data = await Storage.getItem( parentKey );
			if ( !data ) {
				alert('An error has occurred');
				return;
			}
			
			// Adds new alarm to list
			data.alarms.push( key );
			await Storage.setItem( parentKey, data );
			
			navigation.goBack();
		};
		
		return {
			title:           'Add Alarm' + title,
			headerBackTitle: 'Cancel',
			headerRight:     parentKey ? <Button
				title='Save'
				onPress={save}
				color={colors.highlight}
			/> : null
		};
	}
	
	componentDidMount() {
		if ( !this.props.navigation.getParam( 'key' ) )
			alert( 'An error has occurred' );
		
		this.props.navigation.setParams( { state: this.state } );
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
		if ( !this.state.type ) {
			return <View>
				<PickDate
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
