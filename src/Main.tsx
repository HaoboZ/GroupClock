import { Constants } from 'expo';
import { Root, StyleProvider, View } from 'native-base';
import * as React from 'react';
import { Platform } from 'react-native';
import { connect } from 'react-redux';
import getTheme from '../native-base-theme/components';
import opposite from '../native-base-theme/variables/opposite';
import platform from '../native-base-theme/variables/platform';
import Ad from './components/Ad';
import ReduxComponent from './components/ReduxComponent';
import debug from './debug';
import AppNavigator from './navigation/AppNavigator';
import AlarmItem from './screens/alarm/AlarmItem';
import { settingsState, themes } from './screens/home/settings/settingsStore';
import TimerItem from './screens/timer/TimerItem';
import store, { AppState } from './store/store';
import Movement from './utils/Movement';
import Notice from './utils/notice/Notice';

type Props = {
	settings: settingsState
};

export default connect( ( store: AppState ) => {
		return {
			settings: store.settings
		} as Props;
	}
)( class Main extends ReduxComponent<Props> {
	
	private interval: number;
	
	public componentDidMount(): void {
		console.disableYellowBox = true;
		Notice.init();
		Movement.init();
		AlarmItem.reset();
		TimerItem.reset();
		this.interval = setInterval( () => {
			store.dispatch( { type: 'timeUpdate' } );
		}, [ 1000, 250, 100, 33.333 ][ this.props.settings.precision ] );
	}
	
	public componentWillUnmount(): void {
		clearInterval( this.interval );
	}
	
	render() {
		return <StyleProvider style={getTheme( this.props.settings.theme === themes.light ? platform : opposite )}>
			<Root>
				<View style={{ paddingTop: Platform.OS === 'ios' ? 0 : Constants.statusBarHeight }}/>
				<AppNavigator
					persistenceKey={this.props.settings.persistence ? 'clockNavigate' : undefined}
					onNavigationStateChange={debug.navigate ? ( prev, current ) => {
						const currentRoute = this.getActiveRouteName( current ),
						      prevRoute    = this.getActiveRouteName( prev );
						
						if ( prevRoute !== currentRoute )
							console.log( `Navigating from ${prevRoute} to ${currentRoute}` );
					} : undefined}
				/>
				<Ad/>
			</Root>
		</StyleProvider>;
	}
	
	private getActiveRouteName( navigationState ) {
		if ( !navigationState ) return null;
		
		const route = navigationState.routes[ navigationState.index ];
		// dive into nested navigators
		if ( route.routes ) return this.getActiveRouteName( route );
		
		return route.routeName;
	}
	
} );
