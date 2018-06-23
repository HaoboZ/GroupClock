import React from 'react';
import { StatusBar, View } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';
import Icon from './components/nativeIcon';

import Alarm from './alarm/alarm';
import Stopwatch from './stopwatch/stopwatch';
import Timer from './timer/timer';
import Settings from './settings';

import config from './config';

export default class extends React.PureComponent {
	
	render() {
		return <View style={[ config.styles.flex ]}>
			<StatusBar barStyle='light-content'/>
			<Main/>
		</View>;
	}
	
}

const Main = createBottomTabNavigator(
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
					function getIcon( name ): string {
						switch (name) {
							case 'Alarm':
								return 'alarm';
							case 'Stopwatch':
								return 'stopwatch';
							case 'Timer':
								return 'timer';
							case 'Settings':
								return 'settings';
						}
						return null;
					}
					
					let iconName = getIcon( routeName );
					if (!iconName)
						return null;
					
					return <Icon
						name={iconName}
						size={25}
						color={tintColor}
					/>;
				}
			}
		},
		tabBarOptions:    {
			activeTintColor: config.colors.highlight,
			style:           {
				backgroundColor: config.colors.navigation
			}
		}
	}
);
