import { Button, Footer, FooterTab, Text } from 'native-base';
import * as React from 'react';
import { createBottomTabNavigator, createStackNavigator } from 'react-navigation';
import Icon from '../components/Icon';
import AlarmDetails from '../screens/alarm/AlarmDetails';
import AlarmScreen from '../screens/alarm/AlarmScreen';
import HomeScreen from '../screens/home/HomeScreen';
import SettingsScreen from '../screens/home/settings/SettingsScreen';
import WatchDetails from '../screens/stopwatch/WatchDetails';
import WatchScreen from '../screens/stopwatch/WatchScreen';
import TimerDetails from '../screens/timer/TimerDetails';
import TimerScreen from '../screens/timer/TimerScreen';

const HomeStack = createStackNavigator( {
	Home:     HomeScreen,
	Settings: SettingsScreen
}, { headerMode: 'none' } );

const AlarmStack = createStackNavigator( {
	AlarmScreen,
	AlarmDetails
}, { headerMode: 'none' } );

const TimerStack = createStackNavigator( {
	TimerScreen,
	TimerDetails
}, { headerMode: 'none' } );

const WatchStack = createStackNavigator( {
	WatchScreen,
	WatchDetails
}, { headerMode: 'none' } );

export default createBottomTabNavigator( {
	HomeStack,
	AlarmStack,
	WatchStack,
	TimerStack
}, {
	tabBarComponent: ( props ) => {
		let { index, routes } = props.navigation.state;
		
		let tab = ( i: number, route: string, icon: string, name: string ) => {
			let active = index === i;
			
			return <FooterTab>
				<Button
					vertical
					active={active}
					onPress={() => props.onTabPress( { route: routes[ i ] } )}
					onLongPress={() => props.onTabLongPress( { route: routes[ i ] } )}
				>
					<Icon active={active} name={icon}/>
					<Text style={{ paddingLeft: 0, paddingRight: 0 }}>{name}</Text>
				</Button>
			</FooterTab>;
		};
		
		return <Footer>
			{tab( 0, 'HomeStack', 'home', 'Home' )}
			{tab( 1, 'AlarmStack', 'alarm', 'Alarm' )}
			{tab( 2, 'WatchStack', 'stopwatch', 'Stopwatch' )}
			{tab( 3, 'TimerStack', 'timer', 'Timer' )}
		</Footer>;
	}
} );
