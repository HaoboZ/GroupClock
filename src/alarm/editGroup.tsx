import React from 'react';
import { Button, ScrollView } from 'react-native';
import NavComponent from '../components/navComponent';
import TimezonePicker from '../components/timezonePicker';

import GroupItem from './items/groupItem';
import Label from './components/label';

import { colors } from '../config';
import { color, style } from '../styles';

export default class EditGroup extends NavComponent {
	
	public state = {
		key:   '',
		label: '',
		tz:    ''
	};
	
	/**
	 * Set state functions.
	 */
	private set = {
		label: label => this.setState( { label } ),
		tz:    tz => this.setState( { tz } )
	};
	
	constructor( props ) {
		super( props );
		const group: GroupItem = this.props.navigation.getParam( 'group' );
		this.state = { key: group.key, label: group.state.label, tz: group.state.tz };
	}
	
	static navigationOptions( { navigation } ) {
		const group: GroupItem = navigation.getParam( 'group' );
		if ( !group )
			alert( 'An error has occurred' );
		
		return {
			title:           `Edit Alarm ${group.state.label}`,
			headerBackTitle: 'Cancel',
			headerRight:     group.key ? <Button
				title='Save'
				onPress={() => {
					const reload = navigation.getParam( 'reload' ),
							state  = navigation.getParam( 'state' )();
					group.state.label = state.label;
					group.state.tz = state.tz;
					group.save().then( () => {
						reload();
						navigation.goBack();
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
		return <ScrollView
			style={[ style.flex, color.background ]}
		>
			<Label label={this.state.label} change={this.set.label}/>
			<TimezonePicker tz={this.state.tz} setTZ={this.set.tz}/>
		</ScrollView>;
	}
	
}
