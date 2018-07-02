import { AsyncStorage } from 'react-native';

export default class Storage {
	
	static async getItem( key: string ) {
		const value = await AsyncStorage.getItem( key );
		if ( !value )
			return null;
		
		const data = JSON.parse( value );
		if ( !data )
			return undefined;
		
		return data;
	}
	
	static async setItem( key: string, data: any ) {
		const value = JSON.stringify( data );
		await AsyncStorage.setItem( key, value );
	}
	
}