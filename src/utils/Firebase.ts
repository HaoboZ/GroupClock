import * as firebase from 'firebase';
import { Alert } from 'react-native';
import { settingsActions } from '../screens/home/settings/settingsStore';
import store from '../store/store';

export default new class Firebase {
	
	db: firebase.database.Database;
	
	user: firebase.User;
	
	data: any;
	
	disabled = false;
	
	constructor() {
		if ( !firebase.apps.length ) {
			firebase.initializeApp( {
				apiKey:            'AIzaSyCNxQL938xsR3zStQPoJH0XV0RHv57t9m4',
				authDomain:        'coen-268.firebaseapp.com',
				databaseURL:       'https://coen-268.firebaseio.com',
				projectId:         'coen-268',
				storageBucket:     'coen-268.appspot.com',
				messagingSenderId: '625850952515'
			} );
			firebase.auth().onAuthStateChanged( async ( user ) => {
				this.user = user;
				
				const db = firebase.database();
				this.db = db;
				if ( db )
					db.ref( 'users/' + user.uid ).once( 'value' ).then( ( snapshot ) => {
						this.data = snapshot;
						console.log( 'database' );
						Alert.alert(
							'Sync Style',
							'Which data to use?',
							[
								{
									text:    'Cloud',
									onPress: () => {
										store.dispatch( settingsActions.reset( this.data ) );
									}
								},
								{
									text:    'Device',
									onPress: () => {
										const items = [ 'alarm', 'folderList', 'settings', 'stopwatch', 'timer' ];
										const state = store.getState();
										for ( let i of items ) {
											this.setVal( i, state[ i ] );
										}
									}
								},
								{
									text:     'Cancel',
									onPress:  () => {
										this.disabled = true;
									}, style: 'cancel'
								}
							]
						);
					} );
			} );
		}
	}
	
	public setVal( key, value ) {
		if ( !this.db || !this.data || this.disabled ) return;
		
		console.log( 'set ' + key );
		this.db.ref( 'users/' + this.user.uid )
			.update( { [ key ]: value } );
	}
	
};
