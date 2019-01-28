import * as _ from 'lodash';
import moment from 'moment-timezone';
import { Body, Button, H1, Item, Label, Left, ListItem, NativeBase, Right, Switch, Text, View } from 'native-base';
import * as React from 'react';
import { Picker, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import platform from '../../../native-base-theme/variables/platform';
import Icon from '../../components/Icon';
import NavigationComponent from '../../components/NavigationComponent';
import FolderList, { folderListItem, FolderListType } from '../../pages/FolderList';
import FolderListModal from '../../pages/FolderList/FolderListModal';
import { folderListActions, folderListState } from '../../pages/FolderList/folderListStore';
import { AppState } from '../../store/store';
import Timezone from '../../utils/Timezone';
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
)( class AlarmScreen extends NavigationComponent<Props> {
	
	render() {
		return <FolderList
			routeName='AlarmScreen'
			initialListKey='AlarmHome'
			initialListName='Alarm Home'
			initialGroupData={() => AlarmGroup.Initial}
			initialItemName='Alarm'
			initialItemData={AlarmItem.Initial}
			loadEdit={item => this.props.alarms[ item.id ]}
			subtitle={list => Timezone.ZTN[ new AlarmGroup( list ).data.timezone ]}
			renderPreList={this.groupControl}
			renderItem={this.renderItem}
			modalGroupContent={this.groupModal}
			modalItemContent={this.itemModal}
			onSave={( item, itemData: alarmItemData | alarmGroupData, id ) => {
				if ( item.type === FolderListType.Item ) {
					itemData = AlarmItem.create( id, itemData as alarmItemData );
					item.value = itemData.targetTime;
				} else {
					itemData = AlarmGroup.create( id, itemData as alarmGroupData );
					if ( item.id ) {
						let list       = this.props.items[ item.parent ],
						    alarmGroup = new AlarmGroup( list );
						if ( alarmGroup.data.timezone !== itemData.timezone )
							AlarmItem.disableChildren( list );
					}
				}
				return item;
			}}
			onDelete={( item ) => {
				if ( item.type === FolderListType.Item )
					new AlarmItem( item ).delete();
				else
					new AlarmGroup( item ).delete();
			}}
			
			navigation={this.props.navigation}
			isFocused={this.props.isFocused}
		/>;
	}
	
	private groupControl = ( list: folderListItem ) => {
		let checked, partial = false;
		for ( let id in list.items ) {
			if ( checked === undefined ) checked = list.items[ id ];
			if ( checked !== list.items[ id ] ) {
				partial = true;
				break;
			}
		}
		
		return <ListItem style={styles.listItem}>
			{this.checkBox( () => {
				for ( let id in list.items ) {
					list.items[ id ] = !checked;
				}
				this.props.dispatch( folderListActions.saveItem( list.id, list ) );
			}, checked, partial )}
			<Body style={styles.center}/>
			<Right style={styles.right}>
				{this.circleButton( {
					dark:    true,
					onPress: () => {
						this.activate( list, ( item ) => {
							new AlarmItem( item ).offAction();
						} );
					}
				}, 'square' )}
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
	
	private renderItem = ( item: folderListItem, GroupNavigate, checked: boolean, updateChecked ) => {
		return <ListItem
			button
			style={styles.listItem}
			onPress={item.type === FolderListType.Group ? GroupNavigate : () => {
				this.props.navigation.navigate( 'AlarmDetails', {
					itemId: item.id
				} );
			}}
		>
			{this.checkBox( updateChecked, checked )}
			{item.type === FolderListType.Group ? this.group( new AlarmGroup( item ) ) : this.item( new AlarmItem( item ) )}
		</ListItem>;
	};
	private group( alarmGroup: AlarmGroup ) {
		return <Body style={styles.body}>
		<H1 numberOfLines={1}>{alarmGroup.item.name}</H1>
		<Text numberOfLines={1}>Timezone: {Timezone.ZTN[ alarmGroup.data.timezone ]}</Text>
		<Text>Items: {alarmGroup.item.value}</Text>
		</Body>;
	}
	private item( alarm: AlarmItem ) {
		let time     = moment.duration( alarm.data.targetTime, 'minutes' ),
		    hour     = time.hours() % 12 ? ( time.hours() % 12 ).toString() : '12',
		    minute   = _.padStart( time.minutes().toString(), 2, '0' ),
		    meridiem = Math.floor( time.hours() / 12 ) ? 'PM' : 'AM';
		let repeat = alarm.data.repeatDays.map( ( val, i ) => {
			let text = day[ i ] + ' ';
			
			return val
				? <Text key={i} style={{ color: platform.brandPrimary }}>{text}</Text>
				: text;
		} );
		return <>
			<Body style={styles.switchBody}>
			<H1 numberOfLines={1}>{alarm.item.name}</H1>
			<Text>Time: {`${hour}:${minute} ${meridiem}`}</Text>
			<Text>Days: {repeat}</Text>
			</Body>
			<Right style={styles.switch}>
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
	
	private groupModal = ( item: alarmGroupData, modal: FolderListModal ) => {
		return <>
			<ListItem
				button icon
				onPress={() => {
					this.props.navigation.navigate( 'Timezone', {
						current:  item.timezone,
						onChange: ( zone: string ) => {
							modal.setState( { groupData: { ...item, timezone: zone } } );
						}
					} );
				}}
			>
				<Body><Text>Timezone</Text></Body>
				<Right>
					<Text>{Timezone.ZTN[ item.timezone ].split( ',' )[ 0 ]}</Text>
					<Icon name='arrow-forward'/>
				</Right>
			</ListItem>
		</>;
	};
	private itemModal = ( item: alarmItemData, modal: FolderListModal ) => {
		let days = item.repeatDays.map( ( val, i ) => <Button
			key={i}
			style={styles.flex}
			transparent={!val}
			onPress={() => {
				item.repeatDays[ i ] = !item.repeatDays[ i ];
				modal.setState( { itemData: { ...item } } );
			}}
		><Text>{day[ i ]}</Text></Button> );
		
		return <>
			<Item stackedLabel>
				<Label style={styles.label}>Time</Label>
				{this.timePicker( item, modal )}
			</Item>
			<Item stackedLabel>
				<Label style={styles.label}>Repeating Days</Label>
				<View style={styles.row}>{days}</View>
			</Item>
		</>;
	};
	
	private checkBox( updateChecked, checked: boolean, partial?: boolean ) {
		return <Left>
			<Button full transparent onPress={updateChecked} style={styles.left}>
				<Icon
					style={styles.fullIcon}
					name={partial ? 'remove-circle-outline' : `radio-button-${checked ? 'on' : 'off'}`}
				/>
			</Button>
		</Left>;
	}
	private activate( list: folderListItem, func: ( item: folderListItem ) => void ) {
		if ( list.type !== FolderListType.Group ) {
			func( list );
			return;
		}
		for ( let id in list.items ) {
			if ( list.items[ id ] === true )
				this.activate( this.props.items[ id ], func );
		}
	}
	
	private circleButton( props: NativeBase.Button, name: string ) {
		return <Button
			style={styles.circular}
			{...props}
		>
			<Icon name={name}/>
		</Button>;
	}
	
	private timePicker( item: alarmItemData, modal: FolderListModal ) {
		let time = moment.duration( item.targetTime, 'minutes' );
		
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
		let nums = [];
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

let size = 52;

const styles = StyleSheet.create( {
	flex:             { flex: 1 },
	row:              { flex: 1, flexDirection: 'row' },
	listItem:         { height: 72, marginLeft: 0 },
	body:             { flex: 7 },
	switchBody:       { flex: 5 },
	center:           { flex: 4 },
	left:             {
		height: 72,
		width:  '100%'
	},
	right:            {
		flex:           3,
		flexDirection:  'row',
		justifyContent: 'space-between'
	},
	switch:           { flex: 2 },
	circular:         {
		justifyContent: 'center',
		width:          size,
		height:         size,
		borderRadius:   size / 2
	},
	circleButtonText: {
		color:        '#fff',
		paddingLeft:  0,
		paddingRight: 0
	},
	fullIcon:         {
		marginLeft:  0,
		marginRight: 0
	},
	label:            {
		paddingBottom: 5
	}
} );
