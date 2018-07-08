import React from 'react';
import { createBottomTabNavigator } from 'react-navigation';
import NativeIcon from './components/nativeIcon';

import Alarm from './alarm/alarmList';
import Timer from './timer/timer';
import Stopwatch from './stopwatch/stopwatch';
import Settings from './settings';

import { colors } from './config';
import { color } from './styles';

const routeIcons = {
	Alarm:     'alarm',
	Stopwatch: 'stopwatch',
	Timer:     'timer',
	Settings:  'settings'
};

const MainNav = createBottomTabNavigator(
	{
		Alarm:     Alarm,
		Stopwatch: Stopwatch,
		Timer:     Timer,
		Settings:  Settings
	},
	{
		initialRouteName: 'Alarm',
		navigationOptions( { navigation } ) {
			const { routeName } = navigation.state;
			
			return {
				tabBarIcon( { focused, tintColor } ) {
					let iconName = routeIcons[ routeName ] || 'square';
					if ( !iconName )
						return null;
					
					return <NativeIcon
						name={iconName}
						size={25}
						color={tintColor}
					/>;
				}
			}
		},
		tabBarOptions:    {
			activeTintColor: colors.highlight,
			style:           [ color.navigation ]
		}
	}
);

export default MainNav;
