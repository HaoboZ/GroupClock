import React from 'react';
import { View } from 'react-native';
import { createStackNavigator, NavigationRouteConfigMap } from 'react-navigation';
import NativeIcon from './nativeIcon';

import { themeStyle, contentStyle } from '../styles';
import { theme } from '../config';

//TODO: Allow a way for navigator to include modal view
export default function createNavigator( routeConfig: NavigationRouteConfigMap ) {
	return createStackNavigator(
		routeConfig,
		{
			navigationOptions: {
				headerStyle:          [ themeStyle.navigation ],
				headerTitleStyle:     [ themeStyle.foreground ],
				headerBackTitleStyle: [ themeStyle.highlight ],
				// Changes back arrow to be custom colored
				headerBackImage:      <View style={[ contentStyle.buttonPadding ]}>
												 <NativeIcon
													 name='arrow-back'
													 color={theme.highlight}
													 size={30}
												 />
											 </View>
			}
		}
	);
}