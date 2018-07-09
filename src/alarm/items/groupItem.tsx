import React from 'react';
import Storage from '../../extend/storage';
import { Group } from 'react-native';
import { color } from '../../styles';
import { ListItem } from 'react-native-elements';

export default class GroupItem extends React.PureComponent {
	
	props: {
		k: string,
		onRetrieved?: ( any ) => void
	};
	
	state = {
		type:  '',
		label: '',
		tz:    '',
		items: []
	};
	
	key: string;
	
	constructor( props ) {
		super( props );
		
		this.key = props.k;
	}
	
	componentDidMount() {
		this.load().then();
	}
	
	public static async create( key, label, tz, items ): Promise<GroupItem> {
		if ( key === null )
			key = Math.random().toString( 36 ).substring( 2, 12 );
		let data = { type: 'Group', label, tz, items };
		await Storage.setItem( key, data );
		return new GroupItem( { k: key } );
	}
	
	public async load( direct = false, callback?: ( GroupItem ) => void ) {
		await Storage.getItem( this.key ).then( data => {
			if ( data ) {
				if ( direct )
					this.state = data;
				else
					this.setState( data );
				if ( callback )
					callback( this );
			} else if ( callback )
				callback( null );
		} );
		return this;
	}
	
	public save(): Promise<void> {
		return Storage.mergeItem( this.key,
			{
				label: this.state.label,
				tz:    this.state.tz,
				items: this.state.items
			} );
	}
	
	render() {
		if ( !this.state.type.length )
			return null;
		
		return <ListItem
			containerStyle={[ color.listItem ]}
			topDivider
			bottomDivider
			title={this.state.label}
			titleStyle={[ color.foreground, { fontSize: 42 } ]}
			subtitle={this.state.tz}
			subtitleStyle={[ color.foreground ]}
			switch={{}}
			chevron
		/>
	}
	
}