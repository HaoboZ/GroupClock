import Storage from '../../extend/storage';

export default class Item<T> {
	
	key: string;
	
	load: Promise<T>;
	static loaded: any = {};
	data: { active } & T = null;
	
	constructor( key?: string, noLoad = false ) {
		if ( !key ) {
			this.key = Math.random().toString( 36 ).substring( 2, 12 );
			return;
		}
		this.key = key;
		
		if ( noLoad )
			return;
		if ( Item.loaded[ key ] )
			this.load = Promise.resolve( Item.loaded[ key ] );
		else
			this.load = Item.load( key );
		this.load.then( data => {
			Item.loaded[ key ] = data;
			this.data = data as any;
		} );
	}
	
	static load( key: string ) {
		return Storage.getItem( key );
	}
	
	public create( data: T ) {
		this.data = data as any;
		Item.loaded[ this.key ] = data;
		this.load = Promise.resolve( data );
		return Storage.setItem( this.key, data );
	}
	
	public async save() {
		await Storage.mergeItem( this.key, this.data );
	}
	
	public delete() {
		this.data = null;
		delete Item.loaded[ this.key ];
		return Storage.removeItem( this.key );
	}
	
	public async activate( active ) {
		await this.load;
		this.data.active = active;
		await this.save();
	}
	
}