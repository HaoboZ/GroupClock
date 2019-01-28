import { Root, StyleProvider } from 'native-base';
import * as React from 'react';
import { connect } from 'react-redux';
import getTheme from '../native-base-theme/components';
import opposite from '../native-base-theme/variables/opposite';
import platform from '../native-base-theme/variables/platform';
import ReduxComponent from './components/ReduxComponent';
import AppNavigator from './navigation/AppNavigator';
import AlarmItem from './screens/alarm/AlarmItem';
import Settings from './screens/home/settings/Settings';
import { themes } from './screens/home/settings/settingsStore';
import TimerItem from './screens/timer/TimerItem';
import { AppState } from './store/store';
import Notice from './utils/notice/Notice';

type Props = {
	theme: themes
};

export default connect( ( store: AppState ) => {
		return {
			theme: store.settings.theme
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
			Settings.updateTime();
		}, 1000 );
	}
	
	public componentWillUnmount(): void {
		clearInterval( this.interval );
	}
	
	render() {
		return <StyleProvider style={getTheme( this.props.theme === themes.light ? platform : opposite )}>
			<Root>
				<AppNavigator persistenceKey={'NavigationState'}/>
				{/*<Ad/>*/}
			</Root>
		</StyleProvider>;
	}
	
} );
