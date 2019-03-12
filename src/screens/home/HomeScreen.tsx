import { Accelerometer, Magnetometer } from 'expo';
import { Body, Button, Container, H1, Header, Left, ListItem, NativeBase, Right, Text, Title } from 'native-base';
import * as React from 'react';
import { StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Icon from '../../components/Icon';
import NavigationComponent from '../../components/NavigationComponent';
import { folderListItem, FolderListType } from '../../pages/FolderList';
import { folderListActions, folderListState } from '../../pages/FolderList/folderListStore';
import { AppState } from '../../store/store';
import WatchItem, { State } from '../stopwatch/WatchItem';
import { watchActions, watchState } from '../stopwatch/watchStore';

type Props = {
	time: number;
	items: folderListState;
	watches: watchState;
};

export default connect( ( store: AppState ) => {
	return {
		time:    store.time,
		items:   store.folderList,
		watches: store.stopwatch
	} as Props;
} )(
	class HomeScreen extends NavigationComponent<Props> {
		
		accelerometer: {
			x: {},
			y: {},
			z: {}
		};
		
		magnetometer = 0;
		
		
		public componentWillMount(): void {
			Accelerometer.addListener( accelerometerData => {
				this.accelerometer = accelerometerData;
			} );
			Magnetometer.addListener( data => {
				this.magnetometer = this._angle( data );
			} );
			setInterval( this.calculate, 500 );
		}
		
		calculate = () => {
			const { x, y, z } = this.accelerometer,
			      direction   = this._direction( this._degree( this.magnetometer ) );
			
			const watches = [
				'HomeWatch',
				'NorthWatch',
				'EastWatch',
				'SouthWatch',
				'WestWatch'
			];
			
			for ( let i of watches ) {
				const stopwatch = new WatchItem( this.props.items[ i ] );
				if ( x > 1.5 || x < -1.5 || y > 1.5 || y < -1.5 || z > 1.5 || z < -1.5 ) {
					if ( i === 'HomeWatch'
						|| ( i === 'NorthWatch' && direction == 'N' )
						|| ( i == 'EastWatch' && direction == 'E' )
						|| ( i == 'SouthWatch' && direction == 'S' )
						|| ( i == 'WestWatch' && direction == 'W' ) ) {
						stopwatch.movementOn();
					} else {
						stopwatch.movementOff();
					}
				} else {
					stopwatch.movementOff();
				}
			}
			
		};
		
		_angle = magnetometer => {
			if ( magnetometer ) {
				let { x, y } = magnetometer;
				
				if ( Math.atan2( y, x ) >= 0 ) {
					var angle = Math.atan2( y, x ) * ( 180 / Math.PI );
				} else {
					var angle = ( Math.atan2( y, x ) + 2 * Math.PI ) * ( 180 / Math.PI );
				}
			}
			
			return Math.round( angle );
		};
		
		_direction = degree => {
			if ( degree > 315 || degree <= 45 ) {
				return 'N';
			} else if ( degree > 45 && degree <= 135 ) {
				return 'E';
			} else if ( degree > 135 && degree <= 225 ) {
				return 'S';
			} else {
				return 'W';
			}
		};
		
		// Match the device top with pointer 0° degree. (By default 0° starts from the right of the device.)
		_degree = magnetometer => {
			return magnetometer - 90 >= 0 ? magnetometer - 90 : magnetometer + 271;
		};
		
		public componentDidMount(): void {
			this.createStopWatch( 'HomeWatch', 'Movement' );
			this.createStopWatch( 'NorthWatch', 'North' );
			this.createStopWatch( 'EastWatch', 'East' );
			this.createStopWatch( 'SouthWatch', 'South' );
			this.createStopWatch( 'WestWatch', 'West' );
		}
		
		/**
		 * Creates a new stopwatch if it doesn't exist.
		 * @param id
		 * @param name
		 */
		private createStopWatch( id: string, name: string ) {
			if ( !this.props.items[ id ] ) {
				this.props.dispatch(
					folderListActions.saveItem( id, {
						type:   FolderListType.Item,
						parent: null,
						name,
						value:  0
					} )
				);
				this.props.dispatch(
					watchActions.saveWatch( id, {
						state:     State.OFF,
						startTime: 0,
						savedTime: 0,
						laps:      []
					} )
				);
			}
		}
		
		render() {
			if ( !this.props.items[ 'HomeWatch' ] ) return null;
			if ( !this.props.items[ 'NorthWatch' ] ) return null;
			if ( !this.props.items[ 'EastWatch' ] ) return null;
			if ( !this.props.items[ 'SouthWatch' ] ) return null;
			if ( !this.props.items[ 'WestWatch' ] ) return null;
			
			return (
				<Container>
					{this.header()}
					{this.renderItem( this.props.items[ 'HomeWatch' ] )}
					{this.renderCircle( this.props.items[ 'NorthWatch' ],
						{ marginTop: 0, position: 'absolute', top: 160 } )}
					{this.renderCircle( this.props.items[ 'EastWatch' ], {
						marginTop: 0,
						position:  'absolute',
						top:       305,
						right:     70
					} )}
					{this.renderCircle( this.props.items[ 'SouthWatch' ], { marginTop: 0, position: 'absolute', top: 460 } )}
					{this.renderCircle( this.props.items[ 'WestWatch' ], {
						marginTop: 0,
						position:  'absolute',
						top:       305,
						left:      50
					} )}
				</Container>
			);
		}
		
		private header() {
			return (
				<Header>
					<Left/>
					<Body>
					<Title>Header</Title>
					</Body>
					<Right>
						<Button transparent onPress={this.openSettings}>
							<Icon name="settings"/>
						</Button>
					</Right>
				</Header>
			);
		}
		private openSettings = () => {
			this.props.navigation.navigate( 'Settings' );
		};
		
		private renderCircle = ( item: folderListItem, style ) => {
			var currentWatch = new WatchItem( item );
			
			return <Body style={style}>
			{this.circle( currentWatch )}
			</Body>;
		};
		protected circle( stopwatch: WatchItem ) {
			return <>
				<H1 numberOfLines={1}>{stopwatch.item.name}</H1>
				<Text>{stopwatch.timeString( this.props.time )}</Text>
				
				<Right style={{ position: 'absolute', left: -20, top: 60 }}>
					{this.circleButton(
						{
							[ [ undefined, 'dark', 'danger' ][ stopwatch.data.state ] ]: true,
							
							disabled: stopwatch.data.state === State.OFF,
							onPress:  () => stopwatch.leftAction()
						},
						[ 'repeat', 'repeat', 'square' ][ stopwatch.data.state ]
					)}
				</Right>
				<Right style={{ position: 'absolute', left: 45, top: 60 }}>
					{this.circleButton(
						{
							[ [ 'success', 'warning', 'success' ][ stopwatch.data.state ] ]: true,
							
							onPress: () => stopwatch.rightAction()
						},
						[ 'play', 'pause', 'play' ][ stopwatch.data.state ]
					)}
				</Right>
			</>;
		}
		
		private renderItem = ( item: folderListItem ) => {
			return <ListItem
				button
				style={innerStyle.listItem}
				onPress={() => {
					this.props.navigation.navigate( 'WatchDetails', {
						itemId: item.id
					} );
				}}
			>
				{this.item( new WatchItem( item ) )}
			</ListItem>;
		};
		protected item( stopwatch: WatchItem ) {
			return <>
				<Body style={innerStyle.center}>
				<H1 numberOfLines={1}>{stopwatch.item.name}</H1>
				<Text>Time: {stopwatch.timeString( this.props.time )}</Text>
				<Text>Lap: {stopwatch.toString( stopwatch.lapDiff[ 0 ] )}</Text>
				</Body>
				<Right style={innerStyle.right}>
					{this.circleButton(
						{
							[ [ undefined, 'dark', 'danger' ][ stopwatch.data.state ] ]: true,
							
							disabled: stopwatch.data.state === State.OFF,
							onPress:  () => stopwatch.leftAction()
						},
						[ 'repeat', 'repeat', 'square' ][ stopwatch.data.state ]
					)}
					{this.circleButton(
						{
							[ [ 'success', 'warning', 'success' ][ stopwatch.data.state ] ]: true,
							
							onPress: () => stopwatch.rightAction()
						},
						[ 'play', 'pause', 'play' ][ stopwatch.data.state ]
					)}
				</Right>
			</>;
		}
		
		protected circleButton( props: NativeBase.Button, name: string ) {
			return (
				<Button style={innerStyle.circular} {...props}>
					<Icon name={name}/>
				</Button>
			);
		}
	}
);

const circleSize = 52;
const innerStyle = StyleSheet.create( {
	listItem: { height: 72, marginLeft: 0 },
	body:     { flex: 7 },
	center:   { flex: 4 },
	right:    {
		flex:           3,
		flexDirection:  'row',
		justifyContent: 'space-between'
	},
	circular: {
		justifyContent: 'center',
		width:          circleSize,
		height:         circleSize,
		borderRadius:   circleSize / 2
	}
} );
