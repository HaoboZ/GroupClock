import React from 'react';
import { View } from 'react-native';
import { createStackNavigator, NavigationRouteConfigMap } from 'react-navigation';
import NativeIcon from './nativeIcon';

import { color, style } from '../styles';
import { colors } from '../config';

//TODO: Allow a way for navigator to include modal view
export default function createNavigator( routeConfig: NavigationRouteConfigMap ) {
	return createStackNavigator(
		routeConfig,
		{
			navigationOptions: {
				headerStyle:          [ color.navigation ],
				headerTitleStyle:     [ color.foreground ],
				headerBackTitleStyle: [ color.highlight ],
				headerBackImage:      <View style={style.buttonPadding}>
												 <NativeIcon
													 name='arrow-back'
													 color={colors.highlight}
													 size={30}
												 />
											 </View>
			}
		}
	);
}