import React from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import moment from 'moment-timezone';
import NavComponent, { Options } from '../../extend/navComponent';
import { IconButton } from '../../extend/nativeIcon';

import AlarmStorage from '../alarmStorage';
import Item from '../item/item';
import AlarmGroupItem from '../item/alarmGroupItem';

import AlarmComponent from '../component/alarmComponent';
import AlarmGroupComponent from '../component/alarmGroupComponent';

import { color, style } from '../../styles';
import { colors } from '../../config';

export default class AlarmList extends NavComponent {
	
	state: {
		group: AlarmGroupItem,
		listItems: Array<JSX.Element>,
		refreshing: boolean
	} = {
		group:      null,
		listItems:  [],
		refreshing: false
	};
	
	static navigationOptions( { navigation } ): Options {
		const self: AlarmList = navigation.getParam( 'self' );
		if ( !self || !self.state.group )
			return null;
		
		return {
			title:       self.state.group.data.label,
			headerTitle: ( <View style={[ style.flex, style.row, style.center ]}>
				<IconButton name='open' outline={true} onPress={() => {
					navigation.navigate(
						'EditAlarmGroup',
						{
							list:  self,
							group: self.state.group
						}
					)
				}
				}/>
				<Text style={[ color.foreground, { fontWeight: 'bold', fontSize: 18 } ]}>
					{self.state.group.data.label}
				</Text>
			</View> ),
			headerRight: ( <IconButton
				name='add'
				onPress={() =>
					navigation.navigate(
						'AddAlarm',
						{ list: self }
					)}
				size={40}
			/> )
		};
	}
	
	componentDidMount(): void {
		let group = this.props.navigation.getParam( 'group', null );
		this.state.group = group;
		if ( !group )
			AlarmStorage.init().then( () => this.load().then() );
		else
			this.load().then();
	}
	
	public async load() {
		let group = this.state.group;
		if ( !group ) {
			group = new AlarmGroupItem( 'AlarmStart' );
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
									list: this,
									alarm
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
									group:  group.state.group
								} );
							}}
						/>;
						break;
					}
				} ) );
			}
			this.props.navigation.setParams( { self: this } );
			Promise.all( promises ).then( () => {
				this.setState( { listItems } );
			} );
		} );
	}
	
	render(): JSX.Element {
		if ( !this.state.group )
			return <View style={[ color.background ]}/>;
		
		return <View style={[ color.background, style.flex ]}>
			<Text style={[ style.centerSelf, color.foreground ]}>
				{this.state.group.data.tz}
			</Text>
			<FlatList
				data={this.state.listItems}
				renderItem={this.helper.renderItem}
				refreshControl={<RefreshControl
					refreshing={this.state.refreshing}
					onRefresh={this.helper.onRefresh}
					tintColor={colors.foreground}
				/>}
			/>
		</View>;
	}
	
	private helper = {
		renderItem: ( { item } ) => item,
		onRefresh:  () => {
			this.setState( { refreshing: true } );
			setTimeout(
				() => this.setState( { refreshing: false } ),
				250
			);
		}
	};
	
}
