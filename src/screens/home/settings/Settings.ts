import { Toast } from 'native-base';
import store from '../../../store/store';
import { power, settingsActions, themes } from './settingsStore';

export default new class Settings {
	
	public reset() {
		store.dispatch( settingsActions.reset() );
	}
	
	public permission( permission: boolean ) {
		store.dispatch( settingsActions.permission( permission ) );
	}
	
	public switchTheme( theme: themes ) {
		store.dispatch( settingsActions.theme( theme ) );
		this.reload();
	}
	
	public setTimezone( timezone: string ) {
		store.dispatch( settingsActions.timezone( timezone ) );
	}
	
	public target( power: power ) {
		store.dispatch( settingsActions.precision( power ) );
		this.reload();
	}
	
	public persist( persistence: boolean ) {
		store.dispatch( settingsActions.persistence( persistence ) );
	}
	
	private reload() {
		Toast.show( {
			text:       'Changes will be applied after reload',
			buttonText: 'Close',
			type:       'warning',
			duration:   4000
		} );
	}
	
};
