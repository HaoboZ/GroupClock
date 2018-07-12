import React from 'react';
import { NavigationInjectedProps, NavigationScreenOptions } from 'react-navigation';

export { NavigationScreenOptions as Options } from 'react-navigation';

export default abstract class NavComponent extends React.PureComponent {
	
	props: NavigationInjectedProps;
	
	// noinspection JSUnusedGlobalSymbols
	navigationOptions?( { navigation }: NavigationInjectedProps ): NavigationScreenOptions;
	
}
