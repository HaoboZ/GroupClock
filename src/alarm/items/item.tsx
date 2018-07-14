import React from 'react';
import Storage from '../../extend/storage';

import AlarmList from '../alarmList';

export default abstract class Item extends React.PureComponent {
	
	props: {
		k: string,
		list?: AlarmList,
		onPress?: ( AlarmItem ) => void
	};
	
	abstract state: {
		type: string,
		parent: string,
		label: string,
		active: boolean | number
	};
	
	key: string;
	mounted = false;
	
	// noinspection TypeScriptAbstractClassConstructorCanBeMadeProtected
	constructor( props ) {
		super( props );
		this.key = props.k;
	}
	
	protected static async _create<type>( key, data, type ): Promise<type> {
		if ( !key )
			key = Math.random().toString( 36 ).substring( 2, 12 );
		await Storage.setItem( key, data );
		return new type( { k: key } );
	}
	
	componentDidMount(): void {
		this.mounted = true;
		this.load().then();
	}
	componentWillUnmount(): void {
		this.mounted = false;
	}
	
	public async load( callback?: ( Item ) => void ): Promise<this> {
		await Storage.getItem( this.key ).then( data => {
			if ( data ) {
				if ( this.mounted )
					this.setState( data, () => {
						if ( callback )
							callback( this );
					} );
				else
					Object.assign( this.state, data );
			} else if ( callback )
				callback( null );
		} );
		return this;
	}
	
	public abstract async save(): Promise<void>;
	
	public async delete(...args): Promise<void> {
		await Storage.removeItem( this.key );
	}
	
	public async activate( active ): Promise<void> {
		this.state.active = active;
		await this.save();
	}
	
	onPress = () => this.props.onPress( this );
	
}
