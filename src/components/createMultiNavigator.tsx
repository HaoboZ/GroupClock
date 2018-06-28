import React from 'react';
import { createStackNavigator } from 'react-navigation';

export default function StackModalNavigator( routeConfigs, navigatorConfig ) {
	const { initialRouteName, ...modalNavigatorConfig } = navigatorConfig;
	const { navigationOptions, ...cardNavigatorConfig } = navigatorConfig;
	
	const modalRouteConfig = {};
	Object.keys( routeConfigs ).forEach( routeName => {
		modalRouteConfig[ `${routeName}Modal` ] = routeConfigs[ routeName ];
	} );
	
	const CardStackNavigator = createStackNavigator( routeConfigs, {
		navigationOptions: { header: null },
		...cardNavigatorConfig
	} );
	
	return createStackNavigator(
		{
			CardStackNavigator: { screen: CardStackNavigator },
			...modalRouteConfig
		}, {
			mode: 'modal',
			...modalNavigatorConfig
		}
	);
}
