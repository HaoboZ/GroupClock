import { AsyncStorage } from 'react-native';

export default class Storage {
	
	static async getItem( key: string, callback?: ( error?: Error ) => void ) {
		const value = await AsyncStorage.getItem( key, callback );
		if ( !value )
			return null;
		
		const data = JSON.parse( value );
		if ( !data )
			return undefined;
		
		return data;
	}
	
	static async setItem( key: string, data: any, callback?: ( error?: Error ) => void ) {
		const value = JSON.stringify( data );
		await AsyncStorage.setItem( key, value, callback );
	}
	
	static async mergeItem( key: string, data: any, callback?: ( error?: Error ) => void ) {
		const value = JSON.stringify( data );
		await AsyncStorage.mergeItem( key, value, callback );
	}
	
}