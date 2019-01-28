import { Toast } from 'native-base';
import store from '../../../store/store';
import { settingsActions, themes } from './settingsStore';

export default new class Settings {
	
	public reset() {
		store.dispatch( settingsActions.reset() );
	}
	
	public updateTime() {
		store.dispatch( settingsActions.update() );
	}
	
	public permission( permission: boolean ) {
		store.dispatch( settingsActions.permission( permission ) );
	}
	
	public switchTheme( theme: themes ) {
		store.dispatch( settingsActions.theme( theme ) );
		Toast.show( {
			text:       'Reload app to apply changes',
			buttonText: 'close',
			type:       'warning',
			duration:   4000
		} );
	}
	
	public setTimezone( timezone: string ) {
		store.dispatch( settingsActions.timezone( timezone ) );
	}
	
};
