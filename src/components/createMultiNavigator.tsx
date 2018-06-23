import React from 'react';
import { createStackNavigator } from 'react-navigation';

export function StackModalNavigator2( routeConfigs, navigatorConfig ) {
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

export default function StackModalNavigator( routeConfig, navigatorConfig ) {
	const { initialRouteName, ...modalNavigatorConfig } = navigatorConfig;
	const { ...cardNavigatorConfig } = navigatorConfig;
	
	const modalRouteConfig = {};
	Object.keys( routeConfig ).forEach( routeName => {
		modalRouteConfig[ `${routeName}Modal` ] = routeConfig[ routeName ];
	} );
	
	const CardStackNavigator = createStackNavigator( modalRouteConfig, {
		// navigationOptions: { header: null },
		mode: 'modal',
		...modalNavigatorConfig
	} );
	
	return createStackNavigator(
		{
			CardStackNavigator: { screen: CardStackNavigator },
			...routeConfig
		}, {
			// mode: 'modal',
			...cardNavigatorConfig
		}
	);
}
