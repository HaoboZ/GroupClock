import { Root, StyleProvider } from 'native-base';
import * as React from 'react';
import { connect } from 'react-redux';
import getTheme from '../native-base-theme/components';
import opposite from '../native-base-theme/variables/opposite';
import platform from '../native-base-theme/variables/platform';
import ReduxComponent from './components/ReduxComponent';
import AppNavigator from './navigation/AppNavigator';
import AlarmItem from './screens/alarm/AlarmItem';
import { settingsState, themes } from './screens/home/settings/settingsStore';
import TimerItem from './screens/timer/TimerItem';
import store, { AppState } from './store/store';
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
				<AppNavigator persistenceKey={this.props.settings.persistence ? 'clockNavigate' : undefined}/>
				{/*<Ad/>*/}
			</Root>
		</StyleProvider>;
	}
	
} );
