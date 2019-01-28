import 'moment-duration-format';
import moment from 'moment-timezone';

export default new class Timezone {
	
	public readonly zones: string[];
	public readonly names: string[];
	
	public readonly ZTN: { [ name: string ]: string } = {};
	public readonly NTZ: { [ name: string ]: string } = {};
	
	constructor() {
		this.zones = moment.tz.names();
		this.zones.unshift( 'Default' );
		this.names = this.zones.map( ( val ) => {
			let res = /(\w+)\/(\w+)/.exec( val );
			if ( res )
				return ( res[ 2 ] + ', ' + res[ 1 ] ).replace( '_', ' ' );
			else
				return val;
		} );
		
		for ( let i = 0; i < this.zones.length; ++i ) {
			this.ZTN[ this.zones[ i ] ] = this.names[ i ];
		}
		
		for ( let i = 0; i < this.zones.length; ++i ) {
			this.NTZ[ this.names[ i ] ] = this.zones[ i ];
		}
	}
	
	public getUTC( zone: string ) {
		return 'UTC' + (
			moment().tz( zone === 'Default'
				? moment.tz.guess() : zone ).format( 'Z' )
		);
	}
	
};

