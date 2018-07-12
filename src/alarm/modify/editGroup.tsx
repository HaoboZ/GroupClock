import React from 'react';
import { Button, View } from 'react-native';
import NavComponent, { Options } from '../../extend/navComponent';
import TimezonePicker from '../../components/timezonePicker';

import { AlarmList } from '../alarmList';
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
		let parent: AlarmList = this.props.navigation.getParam( 'list' );
		this.state.group = parent.state.group;
		this.state.label = this.state.group.state.label;
		this.state.tz = this.state.group.state.tz;
	}
	
	static navigationOptions( { navigation } ): Options {
		const list: AlarmList = navigation.getParam( 'list' );
		if ( !list )
			alert( 'An error has occurred' );
		const group = list.state.group;
		
		return {
			title:           `Edit Group ${group.state.label}`,
			headerBackTitle: 'Cancel',
			headerRight:     group.key ? <Button
				title='Save'
				onPress={() => {
					const state = navigation.getParam( 'state' )();
					group.state.label = state.label;
					group.state.tz = state.tz;
					group.save().then( () => {
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
			<Delete onPress={() => this.state.group.delete().then( () => {
				let list: AlarmList = this.props.navigation.getParam( 'list' );
				let items = list.state.group.state.items;
				items.splice( items.indexOf( this.state.group.key ), 1 );
				list.state.group.save().then( () => {
					list.setState( { dirty: true } );

					let parent: AlarmList = list.props.navigation.getParam( 'parent', null );
					if ( parent )
						parent.setState( { dirty: true } );
					
					this.props.navigation.pop( 2 );
				} );
			} )}/>
			<Label label={this.state.label} change={this.set.label}/>
			<TimezonePicker tz={this.state.tz} setTZ={this.set.tz}/>
		</View>;
	}
	
}
