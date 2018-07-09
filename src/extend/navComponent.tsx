import React from 'react';
import { NavigationInjectedProps, NavigationScreenOptions } from 'react-navigation';

export default abstract class NavComponent extends React.PureComponent {
	
	props: NavigationInjectedProps;
	
	navigationOptions?( { navigation }: NavigationInjectedProps ): NavigationScreenOptions;
	
}
