import { Constants } from 'expo';
import { Body, Button, Container, Content, Header, List, ListItem, Right, Separator, Switch, Text, Title, View } from 'native-base';
import * as React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { connect } from 'react-redux';
import Icon from '../../../components/Icon';
import NavigationComponent from '../../../components/NavigationComponent';
import { AppState } from '../../../store/store';
import Timezone from '../../../utils/Timezone';
import { alarmActions } from '../../alarm/alarmStore';
import { watchActions } from '../../stopwatch/watchStore';
import { timerActions } from '../../timer/timerStore';
import Settings from './Settings';
import { settingsState, themes } from './settingsStore';

type Props = {
	settings: settingsState,
};

export default connect( ( store: AppState ) => {
		return {
			settings: store.settings
		} as Props;
	}
)( class SettingsScreen extends NavigationComponent<Props> {
	
	render() {
		return <Container>
			{this.header()}
			<Content>
				{this.items()}
				{this.version()}
			</Content>
		</Container>;
	}
	
	private header() {
		return <Header>
			{this.goBack()}
			<Body><Title>Settings</Title></Body>
			<Right/>
		</Header>;
	}
	
	private items() {
		return <List>
			{this.login()}
			<Separator/>
			{this.theme()}
			{this.timezone()}
			{this.precision()}
			{this.persistence()}
			<Separator/>
			{this.removeAd()}
			{this.donate()}
			{this.reset()}
		</List>;
	}
	
	private login() {
		return <ListItem
			button icon
			onPress={() => {
				alert( 'To Be Implemented' );
			}}
		>
			<Body><Text>Login/Logout</Text></Body>
		</ListItem>;
	}
	
	private theme() {
		return <ListItem icon>
			<Body><Text>Light Theme</Text></Body>
			<Right>
				<Switch
					value={this.props.settings.theme === themes.light}
					onValueChange={( value ) => {
						Settings.switchTheme( value ? themes.light : themes.dark );
					}}/>
			</Right>
		</ListItem>;
	}
	private timezone() {
		return <ListItem
			button icon
			onPress={() => {
				this.props.navigation.navigate( 'Timezone', {
					current:  this.props.settings.timezone,
					onChange: ( zone: string ) => {
						Settings.setTimezone( zone );
					}
				} );
			}}
		>
			<Body><Text>Default Timezone</Text></Body>
			<Right>
				<Text>{Timezone.ZTN[ this.props.settings.timezone ].split( ',' )[ 0 ]}</Text>
				<Icon name='arrow-forward'/>
			</Right>
		</ListItem>;
	}
	private precision() {
		return <ListItem
			button icon
			onPress={() => {
				this.props.navigation.navigate( 'Selector', {
					list:    [ 'Low', 'Medium', 'High', 'Extreme' ],
					current: this.props.settings.precision,
					select:  ( i ) => {
						Settings.target( i );
					}
				} );
			}}
		>
			<Body><Text>Precision/Power Usage</Text></Body>
			<Right><Text>{[ 'Low', 'Medium', 'High', 'Extreme' ][ this.props.settings.precision ]}</Text></Right>
		</ListItem>;
	}
	private persistence() {
		return <ListItem icon>
			<Body><Text>Save State (WIP)</Text></Body>
			<Right>
				<Switch
					value={this.props.settings.persistence}
					onValueChange={( value ) => {
						Settings.persist( value );
					}}/>
			</Right>
		</ListItem>;
	}
	
	private removeAd() {
		return <ListItem
			button icon
			onPress={() => {
				alert( 'To Be Implemented' );
			}}
		>
			<Body><Text>Remove Ads</Text></Body>
			{/*<Right><Text>99¢</Text></Right>*/}
		</ListItem>;
	}
	private donate() {
		return <ListItem
			button icon
			onPress={() => {
				alert( 'To Be Implemented' );
			}}
		>
			<Body><Text>Donate!</Text></Body>
		</ListItem>;
	}
	private reset() {
		return <>
			<Button
				full danger
				onPress={() => {
					this.resetAlert( 'All', Settings.reset );
				}}
			>
				<Text>Reset All</Text>
			</Button>
			<View style={styles.row}>
				{this.resetButton( 'Alarm', alarmActions.resetAlarm )}
				{this.resetButton( 'Stopwatch', watchActions.resetWatch )}
				{this.resetButton( 'Timer', timerActions.resetTimer )}
			</View>
		</>;
	}
	
	private version() {
		return <Separator style={{ paddingLeft: 0 }}>
			<Text style={{ alignSelf: 'center' }}>Version: {Constants.manifest.version}</Text>
		</Separator>;
	}
	
	private resetButton( name: string, func: () => void ) {
		return <Button
			warning style={styles.centerButton}
			onPress={() => {
				this.resetAlert( name, func );
			}}
		>
			<Text>{name}</Text>
		</Button>;
	}
	private resetAlert( name: string, func: () => void ) {
		Alert.alert( 'Reset ' + name,
			'Are you sure you want to reset?',
			[
				{
					text:    'Confirm',
					onPress: func
				},
				{ text: 'Cancel' }
			]
		);
	}
	
} );

const styles = StyleSheet.create( {
	row:          { flex: 1, flexDirection: 'row' },
	centerButton: { flex: 1, justifyContent: 'center' }
} );
