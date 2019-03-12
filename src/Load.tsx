import { AppLoading, Font } from 'expo';
import * as React from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import Main from './Main';
import store, { persistor } from './store/store';
import './utils/Firebase';

export default class Load extends React.Component<{
	skipLoading?: boolean
}> {
	
	state = {
		loading:       true,
		authenticated: false
	};
	
	async componentWillMount() {
		await Font.loadAsync( {
			Roboto:        require( 'native-base/Fonts/Roboto.ttf' ),
			Roboto_medium: require( 'native-base/Fonts/Roboto_medium.ttf' )
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
