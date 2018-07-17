import Storage from '../../extend/storage';

export default class Item<T> {
	
	key: string;
	
	load: Promise<T>;
	data: { active } & T = null;
	
	/**
	 * Stored data from keys.
	 * @type {any}
	 */
	static loaded: any = {};
	
	/**
	 * @param {string=} key generate random key and not load
	 * @param {boolean=false} noLoad does not load data
	 */
	constructor( key?: string, noLoad = false ) {
		if ( !key ) {
			// generates 10 characters random hex
			this.key = Math.random().toString( 36 ).substring( 2, 12 );
			return;
		}
		this.key = key;
		
		// don't load if not needed
		if ( noLoad )
			return;
		if ( Item.loaded[ key ] )
		// if already loaded, direct access
			this.load = Promise.resolve( Item.loaded[ key ] );
		else
		//if not loaded, retrieve from storage
			this.load = Item.load( key );
		this.load.then( data => {
			Item.loaded[ key ] = data;
			this.data = data as any;
		} );
	}
	
	/**
	 * Retrieves key from storage.
	 *
	 * @param {string} key
	 * @returns {Promise<any>}
	 */
	static load( key: string ): Promise<any> {
		return Storage.getItem( key );
	}
	
	/**
	 * Creates a new item.
	 *
	 * @param {any} data
	 * @returns {Promise<void>}
	 */
	public create( data: T ): Promise<void> {
		this.data = data as any;
		Item.loaded[ this.key ] = data;
		this.load = Promise.resolve( data );
		return Storage.setItem( this.key, data );
	}
	
	/**
	 * Saves current data.
	 *
	 * @returns {Promise<void>}
	 */
	public async save(): Promise<void> {
		await Storage.mergeItem( this.key, this.data );
	}
	
	/**
	 * Deletes item.
	 *
	 * @returns {Promise<void>}
	 */
	public delete(): Promise<void> {
		this.data = null;
		delete Item.loaded[ this.key ];
		return Storage.removeItem( this.key );
	}
	
	/**
	 * Changes active state.
	 *
	 * @param {boolean | number} active
	 * @returns {Promise<void>}
	 */
	public async activate( active: boolean | number ): Promise<void> {
		await this.load;
		this.data.active = active;
		await this.save();
	}
	
}
