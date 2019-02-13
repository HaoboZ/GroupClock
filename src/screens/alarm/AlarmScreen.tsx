import * as _ from 'lodash';
import moment from 'moment-timezone';
import { Body, Button, H1, Item, Label, ListItem, Right, Switch, Text, View } from 'native-base';
import * as React from 'react';
import { Picker, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import platform from '../../../native-base-theme/variables/platform';
import Icon from '../../components/Icon';
import FolderList, { folderListItem, FolderListType } from '../../pages/FolderList';
import FolderListModal from '../../pages/FolderList/FolderListModal';
import { folderListActions, folderListState } from '../../pages/FolderList/folderListStore';
import { AppState } from '../../store/store';
import styles from '../../styles';
import Timezone from '../../utils/Timezone';
import CommonScreen from '../CommonScreen';
import AlarmGroup, { alarmGroupData } from './AlarmGroup';
import AlarmItem, { alarmItemData } from './AlarmItem';
import { alarmState } from './alarmStore';

let day = [ 'S', 'M', 'T', 'W', 'T', 'F', 'S' ];

type Props = {
	items: folderListState,
	alarms: alarmState
};

export default connect( ( store: AppState ) => {
		return {
			items:  store.folderList,
			alarms: store.alarm
		} as Props;
	}
)( class AlarmScreen extends CommonScreen<Props> {
	
	render() {
		return <FolderList
			routeName='AlarmScreen'
			initialListKey='AlarmHome'
			initialListName='Alarm Home'
			initialGroupData={() => AlarmGroup.Initial}
			initialItemName='Alarm'
			initialItemData={AlarmItem.Initial}
			loadEdit={( item ) => this.props.alarms[ item.id ]}
			subtitle={( list ) => Timezone.ZTN[ new AlarmGroup( list ).data.timezone ]}
			
			{...this.listProps()}
		/>;
	}
	
	protected groupControl = ( list: folderListItem ) => {
		let checked, partial = false;
		for ( const id in list.items ) {
			if ( checked === undefined ) checked = list.items[ id ];
			if ( checked !== list.items[ id ] ) {
				partial = true;
				break;
			}
		}
		
		return <ListItem style={innerStyle.listItem}>
			{this.checkBox( () => {
				for ( const id in list.items )
					list.items[ id ] = partial ? false : !checked;
				
				this.props.dispatch( folderListActions.saveItem( list.id, list ) );
			}, checked, partial )}
			<Body style={innerStyle.center}/>
			<Right style={innerStyle.right}>
				{this.circleButton( {
					dark:    true,
					onPress: () => {
						this.activate( list, ( item ) => {
							new AlarmItem( item ).offAction();
						} );
					}
				}, 'pause' )}
				{this.circleButton( {
					dark:    true,
					onPress: () => {
						this.activate( list, ( item ) => {
							new AlarmItem( item ).onAction();
						} );
					}
				}, 'play' )}
			</Right>
		</ListItem>;
	};
	
	protected itemRoute = 'AlarmDetails';
	protected createGroup = ( item: folderListItem ) => new AlarmGroup( item );
	protected group( alarmGroup: AlarmGroup ) {
		return <Body style={innerStyle.body}>
		<H1 numberOfLines={1}>{alarmGroup.item.name}</H1>
		<Text numberOfLines={1}>Timezone: {Timezone.ZTN[ alarmGroup.data.timezone ]}</Text>
		<Text>Items: {alarmGroup.item.value}</Text>
		</Body>;
	}
	protected createItem = ( item: folderListItem ) => new AlarmItem( item );
	protected item( alarm: AlarmItem ) {
		const time     = moment.duration( alarm.data.targetTime, 'minutes' ),
		      hour     = time.hours() % 12 ? ( time.hours() % 12 ).toString() : '12',
		      minute   = _.padStart( time.minutes().toString(), 2, '0' ),
		      meridiem = Math.floor( time.hours() / 12 ) ? 'PM' : 'AM';
		const repeat = alarm.data.repeatDays.map( ( val, i ) => {
			const text = day[ i ] + ' ';
			
			return val
				? <Text key={i} style={innerStyle.primary}>{text}</Text>
				: text;
		} );
		return <>
			<Body style={innerStyle.switchBody}>
			<H1 numberOfLines={1}>{alarm.item.name}</H1>
			<Text>Time: {`${hour}:${minute} ${meridiem}`}</Text>
			<Text>Days: {repeat}</Text>
			</Body>
			<Right style={innerStyle.switch}>
				<Switch
					value={!!alarm.data.state}
					onValueChange={( val ) => {
						if ( !val ) alarm.offAction();
						else alarm.onAction();
					}}
				/>
			</Right>
		</>;
	}
	
	protected groupModal = ( data: alarmGroupData, modal: FolderListModal ) => {
		return <>
			<ListItem
				button icon
				onPress={() => {
					this.props.navigation.navigate( 'Timezone', {
						current:  data.timezone,
						onChange: ( zone: string ) => {
							modal.setState( { groupData: { ...data, timezone: zone } } );
						}
					} );
				}}
			>
				<Body><Text>Timezone</Text></Body>
				<Right>
					<Text>{Timezone.ZTN[ data.timezone ].split( ',' )[ 0 ]}</Text>
					<Icon name='arrow-forward'/>
				</Right>
			</ListItem>
		</>;
	};
	protected itemModal = ( data: alarmItemData, modal: FolderListModal ) => {
		const days = data.repeatDays.map( ( val, i ) => <Button
			key={i}
			style={styles.flex}
			transparent={!val}
			onPress={() => {
				data.repeatDays[ i ] = !data.repeatDays[ i ];
				modal.setState( { itemData: { ...data } } );
			}}
		><Text>{day[ i ]}</Text></Button> );
		
		return <>
			<Item stackedLabel>
				<Label style={innerStyle.label}>Time</Label>
				{this.timePicker( data, modal )}
			</Item>
			<Item stackedLabel>
				<Label style={innerStyle.label}>Repeating Days</Label>
				<View style={styles.row}>{days}</View>
			</Item>
		</>;
	};
	
	protected onSave = ( item: folderListItem, data: alarmItemData | alarmGroupData, id: string ) => {
		if ( item.type === FolderListType.Item ) {
			data = AlarmItem.create( id, data as alarmItemData );
			item.value = data.targetTime;
		} else {
			data = AlarmGroup.create( id, data as alarmGroupData );
			if ( item.id ) {
				const list       = this.props.items[ item.parent ],
				      alarmGroup = new AlarmGroup( list );
				if ( alarmGroup.data.timezone !== data.timezone )
					AlarmItem.disableChildren( list );
			}
		}
		return item;
	};
	protected onDelete = ( item: folderListItem ) => {
		if ( item.type === FolderListType.Item )
			new AlarmItem( item ).delete();
		else
			new AlarmGroup( item ).delete();
	};
	
	private timePicker( item: alarmItemData, modal: FolderListModal ) {
		const time = moment.duration( item.targetTime, 'minutes' );
		
		return <View style={styles.row}>
			<Picker
				style={styles.flex}
				selectedValue={time.hours() % 12}
				onValueChange={( val ) => {
					modal.setState( {
						itemData: {
							...item,
							targetTime: time.add( val % 12 - time.hours() % 12, 'hours' ).asMinutes()
						}
					} );
				}}
			>
				{this.pickerNumbers( 0, 11, false )}
			</Picker>
			<Picker
				style={styles.flex}
				selectedValue={time.minutes()}
				onValueChange={( val ) => {
					modal.setState( {
						itemData: {
							...item,
							targetTime: time.add( val - time.minutes(), 'minutes' ).asMinutes()
						}
					} );
				}}
			>
				{this.pickerNumbers( 0, 59, true )}
			</Picker>
			<Picker
				style={styles.flex}
				selectedValue={Math.floor( time.hours() / 12 )}
				onValueChange={( val ) => {
					modal.setState( {
						itemData: {
							...item,
							targetTime: time.add( val * 12 - Math.floor( time.hours() / 12 ) * 12, 'hours' ).asMinutes()
						}
					} );
				}}
			>
				<Picker.Item label='AM' value={0}/>
				<Picker.Item label='PM' value={1}/>
			</Picker>
		</View>;
	}
	private pickerNumbers( min: number, max: number, pad: boolean ) {
		const nums = [];
		for ( let num = min; num <= max; ++num ) {
			nums.push( <Picker.Item
				key={num}
				label={!pad ? ( num ? num.toString() : '12' ) : _.padStart( num.toString(), 2, '0' )}
				value={num}
			/> );
		}
		return nums;
	}
	
} );

const innerStyle = StyleSheet.create( {
	listItem:   { height: 72, marginLeft: 0 },
	body:       { flex: 7 },
	center:     { flex: 4 },
	right:      {
		flex:           3,
		flexDirection:  'row',
		justifyContent: 'space-between'
	},
	switchBody: { flex: 5 },
	switch:     { flex: 2 },
	primary:    { color: platform.brandPrimary },
	label:      {
		paddingBottom: 5
	}
} );
