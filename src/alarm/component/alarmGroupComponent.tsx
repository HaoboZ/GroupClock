import React from 'react';
import { ListItem } from 'react-native-elements';

import AlarmList from '../routes/alarmList';
import AlarmGroupItem, { SwitchState } from '../item/alarmGroupItem';

import { themeStyle } from '../../styles';
import { theme } from '../../config';
import { StyleSheet } from 'react-native';

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
	
	componentDidMount(): void {
		let group = new AlarmGroupItem( this.props._key );
		group.load.then( () => {
			this.setState( { group, active: group.data.active } );
		} );
	}
	
	/**
	 * @returns {JSX.Element}
	 */
	render(): JSX.Element {
		if ( !this.state.group )
			return null;
		
		return <ListItem
			containerStyle={[ themeStyle.listItem ]}
			topDivider
			bottomDivider
			title={this.state.group.data.label}
			titleStyle={[ themeStyle.foreground, style.title ]}
			subtitle={this.state.group.data.tz}
			subtitleStyle={[ themeStyle.foreground ]}
			onPress={this.onPress}
			switch={{
				value:         this.state.active !== SwitchState.off,
				onValueChange: this.onValueChange,
				onTintColor:   this.state.group.data.active === SwitchState.partial ? theme.secondary : undefined
			}}
		/>
	}
	
	onPress = () => this.props.onPress( this );
	
	/**
	 * Changes active value.
	 *
	 * @param {boolean} _active
	 */
	onValueChange = ( _active: boolean ) => {
		let active = _active ? SwitchState.on : SwitchState.off;
		this.setState( { active }, () => {
			this.state.group.activate( active ).then( async () => {
				// activates parent if it changes
				let list = this.props.list;
				while ( list ) {
					let oldActive = list.state.group.data.active;
					let active = await list.state.group.getActive();
					if ( active === oldActive )
						return;
					
					// saves group active property
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

const style = StyleSheet.create( {
	title: { fontSize: 36 }
} );
