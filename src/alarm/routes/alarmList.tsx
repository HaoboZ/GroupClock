import React from 'react';
import { AsyncStorage, FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import NavComponent, { Options } from '../../extend/navComponent';
import { IconButton } from '../../extend/nativeIcon';
import moment from 'moment-timezone';

import AlarmStorage from '../alarmStorage';
import Item from '../item/item';
import AlarmGroupItem from '../item/alarmGroupItem';

import AlarmComponent from '../component/alarmComponent';
import AlarmGroupComponent from '../component/alarmGroupComponent';

import { themeStyle, contentStyle } from '../../styles';
import { theme } from '../../config';

export default class AlarmList extends NavComponent {
	
	state: {
		groupComponent: AlarmGroupComponent,
		group: AlarmGroupItem,
		listItems: Array<JSX.Element>,
		refreshing: boolean
	} = {
		groupComponent: null,
		group:          null,
		listItems:      [],
		refreshing:     false
	};
	
	/**
	 * @param {NavigationScreenProp<NavigationState>} navigation
	 * @returns {NavigationScreenOptions}
	 */
	static navigationOptions( { navigation } ): Options {
		const self: AlarmList = navigation.getParam( 'self' );
		if ( !self )
			return null;
		
		return {
			title:       self.state.group.data.label,
			/**
			 * Adds button to title to navigate to {@link EditAlarmGroup}.
			 */
			headerTitle: ( <View style={[
				contentStyle.flex,
				contentStyle.row,
				contentStyle.center
			]}>
				<IconButton name='open' outline={true} onPress={() => {
					navigation.navigate(
						'EditAlarmGroup',
						{
							list:  self,
							group: self.state.group
						}
					)
				}}/>
				<Text style={[ themeStyle.foreground, style.title ]}>
					{self.state.group.data.label}
				</Text>
			</View> ),
			/**
			 * Navigate to {@link AddAlarm}.
			 */
			headerRight: ( <IconButton
				name='add'
				onPress={() => {
					navigation.navigate(
						'AddAlarm',
						{ list: self }
					);
				}}
				size={40}
			/> )
		};
	}
	
	/**
	 * Runs {@link AlarmStorage.init} for the first list.
	 * Loads data.
	 */
	componentDidMount(): void {
		let group: AlarmGroupComponent = this.props.navigation.getParam( 'group', null );
		this.state.groupComponent = group;
		if ( !group )
			AlarmStorage.init().then( () => this.load().then() );
		else {
			this.state.group = group.state.group;
			this.load().then();
		}
	}
	
	/**
	 * Loads each item from list.
	 *
	 * @returns {Promise<void>}
	 */
	public async load(): Promise<void> {
		let group = this.state.group;
		if ( !group ) {
			// first list beginning
			group = new AlarmGroupItem( 'alarmStart' );
			await group.load.then( async ( data ) => {
				if ( !data ) {
					await group.create( {
						type:   'group',
						parent: null,
						label:  'Alarm',
						tz:     moment.tz.guess(),
						items:  [],
						active: 0
					} );
				}
				this.setState( { group } );
			} );
		}
		
		// loads individual list items
		let promises: Array<Promise<void>> = [];
		let listItems: Array<JSX.Element> = [];
		group.load.then( ( data ) => {
			for ( let [ index, key ] of data.items.entries() ) {
				promises.push( Item.load( key ).then( ( data ) => {
					switch ( data.type ) {
					case 'alarm':
						listItems[ index ] = <AlarmComponent
							key={key} _key={key}
							list={this}
							onPress={( alarm: AlarmComponent ) => {
								this.props.navigation.navigate( 'EditAlarm', {
									list:  this,
									alarm: alarm.state.alarm
								} );
							}}
						/>;
						break;
					case 'group':
						listItems[ index ] = <AlarmGroupComponent
							key={key} _key={key}
							list={this}
							onPress={( group: AlarmGroupComponent ) => {
								this.props.navigation.push( 'AlarmList', {
									parent: this,
									group
								} );
							}}
						/>;
						break;
					}
				} ) );
			}
			// once each item is loaded, set items
			Promise.all( promises ).then( () => {
				this.props.navigation.setParams( { self: this } );
				this.setState( { listItems } );
			} );
		} );
	}
	
	/**
	 * @returns {JSX.Element}
	 */
	render(): JSX.Element {
		if ( !this.state.group )
			return <View style={[ themeStyle.background ]}/>;
		
		return <View style={[ themeStyle.background, contentStyle.flex ]}>
			<Text style={[ contentStyle.centerSelf, themeStyle.foreground ]}>
				{this.state.group.data.tz}
			</Text>
			<FlatList
				data={this.state.listItems}
				renderItem={this.helper.renderItem}
				refreshControl={<RefreshControl
					refreshing={this.state.refreshing}
					onRefresh={this.helper.onRefresh}
					tintColor={theme.foreground}
				/>}
			/>
		</View>;
	}
	
	private helper = {
		renderItem: ( { item } ) => item,
		onRefresh:  async () => {
			this.setState( { refreshing: true } );
			await this.load();
			setTimeout(
				() => this.setState( { refreshing: false } ),
				500
			);
		}
	};
	
}

const style = StyleSheet.create( {
	title: { fontWeight: 'bold', fontSize: 18 }
} );
