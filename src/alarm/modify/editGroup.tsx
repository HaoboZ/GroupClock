import React from 'react';
import { Button, View } from 'react-native';
import NavComponent from '../../extend/navComponent';
import TimezonePicker from '../../components/timezonePicker';

import GroupItem from '../items/groupItem';
import Label from '../components/label';
import Delete from '../components/delete';

import { colors } from '../../config';
import { color, style } from '../../styles';

export default class EditGroup extends NavComponent {
	
	public state: { group: GroupItem, label: string, tz: string } = {
		group: null,
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
		this.state.group = this.props.navigation.getParam( 'group' );
		this.state.label = this.state.group.state.label;
		this.state.tz = this.state.group.state.tz;
	}
	
	static navigationOptions( { navigation } ) {
		const group: GroupItem = navigation.getParam( 'group' );
		if ( !group )
			alert( 'An error has occurred' );
		
		return {
			title:           `Edit Group ${group.state.label}`,
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
			<Delete onPress={() => this.state.group.delete().then( () => {
				this.props.navigation.getParam( 'reload' )();
				this.props.navigation.pop( 2 );
			} )}/>
			<Label label={this.state.label} change={this.set.label}/>
			<TimezonePicker tz={this.state.tz} setTZ={this.set.tz}/>
		</View>;
	}
	
}
