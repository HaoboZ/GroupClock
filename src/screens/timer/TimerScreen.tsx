import moment from 'moment-timezone';
import { Body, Button, H1, Item, Label, Left, ListItem, NativeBase, Right, Text, View } from 'native-base';
import * as React from 'react';
import { Picker, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Icon from '../../components/Icon';
import NavigationComponent from '../../components/NavigationComponent';
import FolderList, { folderListItem, FolderListType, sort } from '../../pages/FolderList';
import FolderListModal from '../../pages/FolderList/FolderListModal';
import { folderListActions, folderListState } from '../../pages/FolderList/folderListStore';
import { AppState } from '../../store/store';
import TimerGroup, { activationType, timerGroupData } from './TimerGroup';
import TimerItem, { State, timerItemData } from './TimerItem';
import { timerState } from './timerStore';

let arr10 = Array.from( Array( 10 ) ).map( ( e, i ) => i + 1 );

type Props = {
	time: number
	items: folderListState
	timers: timerState
};

export default connect( ( store: AppState ) => {
		return {
			time:   store.time,
			items:  store.folderList,
			timers: store.timer
		} as Props;
	}
)( class TimerScreen extends NavigationComponent<Props> {
	
	render() {
		return <FolderList
			routeName='TimerScreen'
			initialListKey='TimerHome'
			initialListName='Timer Home'
			initialGroupData={() => TimerGroup.Initial}
			initialItemName='Timer'
			initialItemData={() => TimerItem.Initial}
			loadEdit={item => this.props.timers[ item.id ]}
			subtitle={list => [ 'All', 'Chain' ][ new TimerGroup( list ).data.activate ]}
			renderPreList={this.groupControl}
			renderItem={this.renderItem}
			modalGroupContent={this.groupModal}
			modalItemContent={this.itemModal}
			onSave={( item, itemData: timerItemData | timerGroupData, id ) => {
				if ( item.type === FolderListType.Item ) {
					itemData = TimerItem.create( id, itemData as timerItemData );
					item.value = itemData.setTime;
				} else
					TimerGroup.create( id, itemData as timerGroupData );
				return item;
			}}
			onDelete={( item ) => {
				if ( item.type === FolderListType.Item )
					new TimerItem( item ).delete();
				else
					new TimerGroup( item ).delete();
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
							new TimerItem( item ).leftAction();
						} );
					}
				}, 'Left' )}
				{this.circleButton( {
					dark:    true,
					onPress: () => {
						if ( new TimerGroup( list ).data.activate === activationType.All )
							this.activate( list, ( item ) => {
								new TimerItem( item ).rightAction();
							} );
						else
							this.activateChain( list, ( item, sum ) =>
								new TimerItem( item ).rightChainAction( sum )
							);
					}
				}, 'Right' )}
			</Right>
		</ListItem>;
	};
	
	private renderItem = ( item: folderListItem, GroupNavigate, checked: boolean, updateChecked ) => {
		return <ListItem
			button
			style={styles.listItem}
			onPress={item.type === FolderListType.Group ? GroupNavigate : () => {
				this.props.navigation.navigate( 'TimerDetails', {
					itemId: item.id
				} );
			}}
		>
			{this.checkBox( updateChecked, checked )}
			{item.type === FolderListType.Group ? this.group( new TimerGroup( item ) ) : this.item( new TimerItem( item ) )}
		</ListItem>;
	};
	private group( timerGroup: TimerGroup ) {
		return <Body style={styles.body}>
		<H1 numberOfLines={1}>{timerGroup.item.name}</H1>
		<Text>Activate: {[ 'All', 'Chain' ][ timerGroup.data.activate ]}</Text>
		<Text>Items: {timerGroup.item.value}</Text>
		</Body>;
	}
	private item( timer: TimerItem ) {
		return <>
			<Body style={styles.center}>
			<H1 numberOfLines={1}>{timer.item.name}</H1>
			<Text>Time: {timer.timeString( this.props.time )}</Text>
			<Text>{timer.data.state === State.OFF ? 'Repeats' : 'Remaining'}: {timer.data.repeat - timer.data.repeatNum}</Text>
			</Body>
			<Right style={styles.right}>
				{this.circleButton( {
					[ [ undefined, 'dark', 'dark' ][ timer.data.state ] ]: true,
					
					disabled: timer.data.state === State.OFF,
					onPress:  () => timer.leftAction()
				}, 'Cancel' )}
				{this.circleButton( {
					[ [ 'success', 'warning', 'success' ][ timer.data.state ] ]: true,
					
					onPress: () => timer.rightAction()
				}, [ 'Start', 'Pause', 'Resume' ][ timer.data.state ] )}
			</Right>
		</>;
	}
	
	private groupModal = ( item: timerGroupData, modal: FolderListModal ) => {
		return <ListItem icon button onPress={() => {
			modal.setState( {
				groupData: {
					...item,
					activate: [ activationType.Chain, activationType.All ][ item.activate ]
				}
			} );
		}}>
			<Body><Text>Activation</Text></Body>
			<Right><Text>{[ 'All', 'Chain' ][ item.activate ]}</Text></Right>
		</ListItem>;
	};
	private itemModal = ( item: timerItemData, modal: FolderListModal ) => {
		let time = moment.duration( item.setTime, 'seconds' );
		
		return <>
			<Item stackedLabel>
				<Label style={styles.label}>Time</Label>
				<View style={{ flex: 1, flexDirection: 'row' }}>
					{this.picker( time.hours() + ' Hours', time.hours(), 23, ( val ) => {
						modal.setState( {
							itemData: {
								...item,
								setTime: time.add( val - time.hours(), 'hours' ).asSeconds()
							}
						} );
					} )}
					{this.picker( time.minutes() + ' Minutes', time.minutes(), 59, ( val ) => {
						modal.setState( {
							itemData: {
								...item,
								setTime: time.add( val - time.minutes(), 'minutes' ).asSeconds()
							}
						} );
					} )}
					{this.picker( time.seconds() + ' Seconds', time.seconds(), 59, ( val ) => {
						modal.setState( {
							itemData: {
								...item,
								setTime: time.add( val - time.seconds(), 'seconds' ).asSeconds()
							}
						} );
					} )}
				</View>
			</Item>
			<ListItem
				button icon
				onPress={() => {
					this.props.navigation.navigate( 'Selector', {
						list:    arr10,
						current: item.repeat - 1,
						select:  ( repeat ) => {
							modal.setState( { itemData: { ...item, repeat: repeat + 1 } } );
						}
					} );
				}}
			>
				<Body style={{ flex: 2 }}><Text>Repeat</Text></Body>
				<Right><Text>{item.repeat}</Text></Right>
			</ListItem>
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
		if ( list.type !== FolderListType.Group )
			return func( list );
		
		for ( let id in list.items ) {
			if ( list.items[ id ] === true )
				this.activate( this.props.items[ id ], func );
		}
	}
	private activateChain( list: folderListItem, func: ( item: folderListItem, sum ) => any, sum = Date.now() ) {
		if ( list.type !== FolderListType.Group )
			return func( list, sum );
		
		const group = new TimerGroup( list );
		if ( group.data.activate === activationType.All ) {
			let max = 0;
			for ( let id in list.items ) {
				if ( list.items[ id ] === true ) {
					let val = this.activateChain( this.props.items[ id ], func, sum );
					max = Math.max( max, val );
				}
			}
			return max;
		} else {
			const items = sort( list );
			let total = 0;
			for ( let item of items ) {
				if ( list.items[ item.id ] === true ) {
					let val = this.activateChain( item, func, sum + total );
					total += val;
				}
			}
			return total;
		}
	}
	
	private circleButton( props: NativeBase.Button, text: string ) {
		return <Button
			style={styles.circular}
			{...props}
		>
			<Text style={styles.circleButtonText} note={text.length > 5}>{text}</Text>
		</Button>;
	}
	
	private picker( label: string, value: number, max: number, change: ( val ) => void ) {
		return <View style={{ flex: 1 }}>
			<Text style={{ alignSelf: 'center' }}>{label}</Text>
			<Picker
				selectedValue={value}
				onValueChange={change}
			>
				{this.pickerNumbers( 0, max )}
			</Picker>
		</View>;
	}
	private pickerNumbers( min: number, max: number ) {
		let nums = [];
		for ( let num = min; num <= max; ++num )
			nums.push( <Picker.Item key={num} label={num.toString()} value={num}/> );
		return nums;
	}
	
} );

let size = 52;

const styles = StyleSheet.create( {
	listItem:         { height: 72, marginLeft: 0 },
	body:             { flex: 7 },
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
