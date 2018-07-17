import React from 'react';
import { Button, View } from 'react-native';
import NavComponent, { Options } from '../../extend/navComponent';

import AlarmList from './alarmList';
import GroupItem, { default as AlarmGroupItem } from '../item/alarmGroupItem';

import Delete from '../component/delete';
import Label from '../component/label';
import TimezonePicker from '../component/timezonePicker';

import { theme } from '../../config';
import { themeStyle, contentStyle } from '../../styles';

export default class EditAlarmGroup extends NavComponent {
	
	public state: {
		group: GroupItem,
		label: string,
		tz: string
	} = {
		group: null,
		label: undefined,
		tz:    undefined
	};
	
	/**
	 * Set state methods passed to components.
	 */
	private set = {
		label: ( label: string ) => this.setState( { label } ),
		tz:    ( tz: string ) => this.setState( { tz } )
	};
	
	/**
	 * @param {NavigationScreenProp<NavigationState>} navigation
	 * @returns {NavigationScreenOptions}
	 */
	static navigationOptions( { navigation } ): Options {
		const self: EditAlarmGroup = navigation.getParam( 'self' );
		if ( !self )
			return null;
		
		return {
			title:           `Edit Group ${self.state.label !== 'Group' ? self.state.label : ''}`,
			headerBackTitle: 'Cancel',
			headerRight:     ( <Button
				title='Save'
				onPress={() => {
					// move properties to group
					Object.assign( self.state.group.data, {
						label: self.state.label,
						tz:    self.state.tz
					} );
					// save and reload list
					self.state.group.save().then( () => {
						const list: AlarmList   = navigation.getParam( 'list' ),
								parent: AlarmList = list.props.navigation.getParam( 'parent' );
						list.load().then( () => {
							// reloads parent to see changes in parent list
							if ( parent )
								parent.load().then();
							navigation.pop();
						} );
					} );
				}}
				color={theme.highlight}
			/> )
		};
	}
	
	componentDidMount(): void {
		const group: AlarmGroupItem = this.props.navigation.getParam( 'group' );
		this.setState( {
			group,
			label: group.data.label,
			tz:    group.data.tz
		}, () => this.props.navigation.setParams( { self: this } ) );
	}
	
	/**
	 * @returns {JSX.Element}
	 */
	render(): JSX.Element {
		if ( !this.state.group )
			return null;
		
		return <View style={[ contentStyle.flex, themeStyle.background ]}>
			<Delete onPress={this.delete}/>
			<Label label={this.state.label} change={this.set.label}/>
			<TimezonePicker tz={this.state.tz} setTZ={this.set.tz}/>
		</View>;
	}
	
	/**
	 * Deletes this group from list.
	 *
	 * @returns {Promise<void>}
	 */
	delete = () => this.state.group.delete().then( () => {
		const list: AlarmList   = this.props.navigation.getParam( 'list' ),
				parent: AlarmList = list.props.navigation.getParam( 'parent' );
		if ( parent ) {
			// checks that parent exists so that it can navigate to that
			let items = parent.state.group.data.items;
			items.splice( items.indexOf( this.state.group.key ), 1 );
			parent.state.group.save().then( () =>
				parent.load().then( () => this.props.navigation.pop( 2 ) )
			);
		} else {
			// first list, so only resets that list
			list.state.group = null;
			list.load().then( () => this.props.navigation.pop() );
		}
	} );
	
}
