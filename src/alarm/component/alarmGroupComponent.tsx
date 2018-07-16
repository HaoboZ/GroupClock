import React from 'react';
import { ListItem } from 'react-native-elements';

import AlarmList from '../routes/alarmList';
import AlarmGroupItem from '../item/alarmGroupItem';

import { color } from '../../styles';

export const SwitchState = {
	off:     0,
	on:      1,
	partial: 2
};

export default class AlarmGroupComponent extends React.PureComponent {
	
	props: {
		_key: string,
		list: AlarmList,
		onPress: ( AlarmGroupComponent ) => void
	};
	
	state: {
		group: AlarmGroupItem,
	} = {
		group: null,
	};
	
	componentDidMount() {
		let group = new AlarmGroupItem( this.props._key );
		group.load.then( () => {
			this.setState( { group } );
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
				value:         this.state.group.data.active !== SwitchState.off,
				onValueChange: ( active ) => {
					this.setState( { active: active ? 1 : 0 }, () => {
						// reset list
					} );
				},
				onTintColor:   this.state.group.data.active === SwitchState.partial ? '#007fff' : undefined
			}}
		/>
	}
	
	onPress = () => this.props.onPress( this );
	
}