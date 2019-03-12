import * as firebase from 'firebase';

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
		}
	}
	
	public setVal( key, value ) {
		if ( !this.db || !this.data || this.disabled || !this.user ) return;
		
		console.log( 'set ' + key );
		this.db.ref( 'users/' + this.user.uid )
			.update( { [ key ]: value } );
	}
	
};
