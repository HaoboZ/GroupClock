import moment from 'moment-timezone';
import { Body, H1, Item, Label, ListItem, Right, Text, View } from 'native-base';
import * as React from 'react';
import { Picker, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import FolderList, { folderListItem, FolderListType, sort } from '../../pages/FolderList';
import FolderListModal from '../../pages/FolderList/FolderListModal';
import { folderListActions, folderListState } from '../../pages/FolderList/folderListStore';
import { AppState } from '../../store/store';
import styles from '../../styles';
import CommonScreen from '../CommonScreen';
import TimerGroup, { activationType, timerGroupData } from './TimerGroup';
import TimerItem, { State, timerItemData } from './TimerItem';
import { timerState } from './timerStore';

const arr10 = Array.from( Array( 10 ) ).map( ( e, i ) => i + 1 );

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
)( class TimerScreen extends CommonScreen<Props> {
	
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
							new TimerItem( item ).leftAction();
						} );
					}
				}, 'arrow-round-down' )}
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
				}, 'arrow-round-down' )}
			</Right>
		</ListItem>;
	};
	
	protected itemRoute = 'TimerDetails';
	protected createGroup = ( item: folderListItem ) => new TimerGroup( item );
	protected group( timerGroup: TimerGroup ) {
		return <Body style={innerStyle.body}>
		<H1 numberOfLines={1}>{timerGroup.item.name}</H1>
		<Text>Activate: {[ 'All', 'Chain' ][ timerGroup.data.activate ]}</Text>
		<Text>Items: {timerGroup.item.value}</Text>
		</Body>;
	}
	protected createItem = ( item: folderListItem ) => new TimerItem( item );
	protected item( timer: TimerItem ) {
		return <>
			<Body style={innerStyle.center}>
			<H1 numberOfLines={1}>{timer.item.name}</H1>
			<Text>Time: {timer.timeString( this.props.time )}</Text>
			<Text>{timer.data.state === State.OFF ? 'Repeats' : 'Remaining'}: {timer.data.repeat - timer.data.repeatNum}</Text>
			</Body>
			<Right style={innerStyle.right}>
				{this.circleButton( {
					[ [ undefined, 'danger', 'danger' ][ timer.data.state ] ]: true,
					
					disabled: timer.data.state === State.OFF,
					onPress:  () => timer.leftAction()
				}, 'square' )}
				{this.circleButton( {
					[ [ 'success', 'warning', 'success' ][ timer.data.state ] ]: true,
					
					onPress: () => timer.rightAction()
				}, [ 'play', 'pause', 'play' ][ timer.data.state ] )}
			</Right>
		</>;
	}
	
	protected groupModal = ( data: timerGroupData, modal: FolderListModal ) => {
		return <ListItem icon button onPress={() => {
			modal.setState( {
				groupData: {
					...data,
					activate: [ activationType.Chain, activationType.All ][ data.activate ]
				}
			} );
		}}>
			<Body><Text>Activation</Text></Body>
			<Right><Text>{[ 'All', 'Chain' ][ data.activate ]}</Text></Right>
		</ListItem>;
	};
	protected itemModal = ( data: timerItemData, modal: FolderListModal ) => {
		const time = moment.duration( data.setTime, 'seconds' );
		
		return <>
			<Item stackedLabel>
				<Label style={innerStyle.label}>Time</Label>
				<View style={styles.row}>
					{this.picker( time.hours() + ' Hours', time.hours(), 23, ( val ) => {
						modal.setState( {
							itemData: {
								...data,
								setTime: time.add( val - time.hours(), 'hours' ).asSeconds()
							}
						} );
					} )}
					{this.picker( time.minutes() + ' Minutes', time.minutes(), 59, ( val ) => {
						modal.setState( {
							itemData: {
								...data,
								setTime: time.add( val - time.minutes(), 'minutes' ).asSeconds()
							}
						} );
					} )}
					{this.picker( time.seconds() + ' Seconds', time.seconds(), 59, ( val ) => {
						modal.setState( {
							itemData: {
								...data,
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
						current: data.repeat - 1,
						select:  ( repeat ) => {
							modal.setState( { itemData: { ...data, repeat: repeat + 1 } } );
						}
					} );
				}}
			>
				<Body><Text>Repeat</Text></Body>
				<Right><Text>{data.repeat}</Text></Right>
			</ListItem>
		</>;
	};
	
	protected onSave = ( item: folderListItem, data: timerItemData | timerGroupData, id: string ) => {
		if ( item.type === FolderListType.Item ) {
			data = TimerItem.create( id, data as timerItemData );
			item.value = data.setTime;
		} else
			TimerGroup.create( id, data as timerGroupData );
		return item;
	};
	protected onDelete = ( item: folderListItem ) => {
		if ( item.type === FolderListType.Item )
			new TimerItem( item ).delete();
		else
			new TimerGroup( item ).delete();
	};
	
	private activateChain( list: folderListItem, func: ( item: folderListItem, sum ) => any, sum = Date.now() ) {
		if ( list.type !== FolderListType.Group )
			return func( list, sum );
		
		const group = new TimerGroup( list );
		if ( group.data.activate === activationType.All ) {
			let max = 0;
			for ( const id in list.items ) {
				if ( list.items[ id ] === true ) {
					const val = this.activateChain( this.props.items[ id ], func, sum );
					max = Math.max( max, val );
				}
			}
			return max;
		} else {
			const items = sort( list );
			let total = 0;
			for ( const item of items ) {
				if ( list.items[ item.id ] === true ) {
					const val = this.activateChain( item, func, sum + total );
					total += val;
				}
			}
			return total;
		}
	}
	
	private picker( label: string, value: number, max: number, change: ( val ) => void ) {
		return <View style={styles.flex}>
			<Text style={innerStyle.centerText}>{label}</Text>
			<Picker
				selectedValue={value}
				onValueChange={change}
			>
				{this.pickerNumbers( 0, max )}
			</Picker>
		</View>;
	}
	private pickerNumbers( min: number, max: number ) {
		const nums = [];
		for ( let num = min; num <= max; ++num )
			nums.push( <Picker.Item key={num} label={num.toString()} value={num}/> );
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
	label:      { paddingBottom: 5 },
	centerText: { alignSelf: 'center' }
} );
