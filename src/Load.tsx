import { AppLoading, Font } from 'expo';
import * as firebase from 'firebase';
import * as React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Main from './Main';
import fb from './screens/home/settings/firebaseUser';
import store, { persistor } from './store/store';

export default class Load extends React.Component<{
	skipLoading?: boolean
}> {
	
	state = {
		loading:       true,
		authenticated: false
	};
	
	async componentWillMount() {
		if ( !firebase.apps.length ) {
			firebase.initializeApp( {
				apiKey:            'AIzaSyARa0qPrnusB9TsPkFA9hRRk4dFRUsEObo',
				authDomain:        'groupclock-268.firebaseapp.com',
				databaseURL:       'https://groupclock-268.firebaseio.com',
				projectId:         'groupclock-268',
				storageBucket:     'groupclock-268.appspot.com',
				messagingSenderId: '881247202497'
				
			} );
		}
		firebase.auth().onAuthStateChanged( async ( user ) => {
			console.log( !!user );
			fb.user = user;
			
			// retrieve all keys from firebase
			// JSON.parse()
			// load to every store
			
			this.setState( { authenticated: true } );
		} );
		
		await Font.loadAsync( {
			Roboto:        require( 'native-base/Fonts/Roboto.ttf' ),
			Roboto_medium: require( 'native-base/Fonts/Roboto_medium.ttf' )
		} );
		this.setState( { loading: false } );
	}
	
	render() {
		if ( this.state.loading && !this.props.skipLoading )
		// @ts-ignore
			return <AppLoading/>;
		
		return <Provider store={store}>
			<PersistGate loading={null} persistor={persistor}>
				<Main/>
			</PersistGate>
		</Provider>;
	}
	
}
