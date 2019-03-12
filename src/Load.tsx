import { AppLoading, Font } from 'expo';
import * as firebase from 'firebase';
import * as React from 'react';
import { Alert } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Main from './Main';
import { settingsActions } from './screens/home/settings/settingsStore';
import store, { persistor } from './store/store';
import './utils/Firebase';
import Firebase from './utils/Firebase';

export default class Load extends React.Component<{
	skipLoading?: boolean
}> {
	
	state = {
		loading: true
	};
	
	async componentWillMount() {
		await Font.loadAsync( {
			Roboto:        require( 'native-base/Fonts/Roboto.ttf' ),
			Roboto_medium: require( 'native-base/Fonts/Roboto_medium.ttf' )
		} );
		firebase.auth().onAuthStateChanged( async ( user ) => {
			Firebase.user = user;
			
			const db = firebase.database();
			Firebase.db = db;
			if ( db && user )
				db.ref( 'users/' + user.uid ).once( 'value' ).then( ( snapshot ) => {
					Firebase.data = snapshot.toJSON();
					console.log( 'database' );
					Alert.alert(
						'Sync Style',
						'Which data to use?',
						[
							{
								text:    'Cloud',
								onPress: () => {
									store.dispatch( settingsActions.reset( Firebase.data ) );
								}
							},
							{
								text:    'Device',
								onPress: () => {
									const items = [ 'alarm', 'folderList', 'stopwatch', 'timer' ];
									const state = store.getState();
									for ( let i of items ) {
										Firebase.setVal( i, state[ i ] );
									}
								}
							},
							{
								text:     'Cancel',
								onPress:  () => {
									Firebase.disabled = true;
								}, style: 'cancel'
							}
						]
					);
				} );
		} );
		
		this.setState( { loading: false } );
		console.log( 'loaded' );
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
