import { AdMobBanner } from 'expo';
import * as React from 'react';

const BANNER_ID = 'ca-app-pub-8262769857484955/6830209806';

export default class Ad extends React.PureComponent {
	
	state = {
		load: 0
	};
	
	render() {
		return <AdMobBanner
			style={{ height: this.state.load }}
			bannerSize='smartBannerPortrait'
			adUnitID={BANNER_ID}
			testDeviceID='EMULATOR'
			onAdViewDidReceiveAd={() => {
				this.setState( { load: undefined } );
			}}
			onDidFailToReceiveAdWithError={( e ) => console.log( e )}
		/>;
	}
	
}
