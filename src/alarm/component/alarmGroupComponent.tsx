import React from 'react';
import { ListItem } from 'react-native-elements';

import AlarmList from '../routes/alarmList';
import AlarmGroupItem, { SwitchState } from '../item/alarmGroupItem';

import { color } from '../../styles';

export default class AlarmGroupComponent extends React.PureComponent {
	
	props: {
		_key: string,
		list: AlarmList,
		onPress: ( AlarmGroupItem ) => void
	};
	
	state: {
		group: AlarmGroupItem,
		active: number
	} = {
		group:  null,
		active: undefined
	};
	
	componentDidMount() {
		let group = new AlarmGroupItem( this.props._key );
		group.load.then( () => {
			this.setState( { group, active: group.data.active } );
		} );
	}
	
	render(): JSX.Element {
		if ( !this.state.group )
			return null;
		
		return <ListItem
			containerStyle={[ color.listItem ]}
			topDivider
			bottomDivider
			title={this.state.group.data.label}
			titleStyle={[ color.foreground, { fontSize: 36 } ]}
			subtitle={this.state.group.data.tz}
			subtitleStyle={[ color.foreground ]}
			onPress={this.onPress}
			switch={{
				value:         this.state.active !== SwitchState.off,
				onValueChange: this.onValueChange,
				onTintColor:   this.state.group.data.active === SwitchState.partial ? '#007fff' : undefined
			}}
		/>
	}
	
	onPress = () => this.props.onPress( this );
	
	onValueChange = ( _active ) => {
		let active = _active ? SwitchState.on : SwitchState.off;
		this.setState( { active }, () => {
			this.state.group.activate( active ).then( async () => {
				let list = this.props.list;
				console.log( 'try to activate' );
				while ( list ) {
					let oldActive = list.state.group.data.active;
					let active = await list.state.group.getActive();
					if ( active === oldActive )
						return;
					
					list.state.group.data.active = active;
					list.state.group.save().then();
					if ( list.state.groupComponent )
						list.state.groupComponent.setState( { active } );
					list = list.props.navigation.getParam( 'parent', null );
				}
			} );
		} );
	};
	
}
