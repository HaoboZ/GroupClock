import * as firebase from 'firebase';
import { Body, Button, Container, Header, Right, Text, Title } from 'native-base';
import * as React from 'react';
import { Alert, StyleSheet, TextInput } from 'react-native';
import NavigationComponent from '../components/NavigationComponent';
import Firebase from '../utils/Firebase';

export default class LoginModal extends NavigationComponent {
	
	state = {
		password: '',
		email:    ''
	};
	
	render() {
		return <Container>
			{this.header()}
			{this.login()}
		</Container>;
	}
	
	private header() {
		return <Header>
			{this.goBack()}
			<Body><Title>Login/Logout</Title></Body>
			<Right/>
		</Header>;
	}
	
	// Occurs when signout is pressed...
	onLogout = () => {
		firebase.auth().signOut().then( () => {
			this.props.navigation.goBack();
		} );
	};
	
	onLogin = () => {
		firebase.auth().signInWithEmailAndPassword( this.state.email, this.state.password )
			.then( () => {
				this.props.navigation.goBack();
			}, ( error ) => {
				Alert.alert( error.message );
				console.log( error.message );
			} );
	};
	
	onSignup = () => {
		firebase.auth().createUserWithEmailAndPassword( this.state.email, this.state.password )
			.then( () => {
				this.props.navigation.goBack();
			}, ( error ) => {
				Alert.alert( error.message );
				console.log( error.message );
			} );
		
	};
	
	login() {
		return <Container
		style={styles.container}>
			<TextInput
				value={this.state.email}
				onChangeText={( email ) => this.setState( { email } )}
				placeholder={'Email'}
				style={styles.input}
			/>
			<TextInput
				value={this.state.password}
				onChangeText={( password ) => this.setState( { password } )}
				placeholder={'Password'}
				secureTextEntry={true}
				style={styles.input}
			/>
			
			<Button
				style={styles.input}
				onPress={this.onSignup}
				disabled={!!Firebase.user}
			><Text
			>Sign up</Text></Button>
			
			<Button
				style={styles.input}
				onPress={this.onLogin}
				disabled={!!Firebase.user}
			><Text>Login</Text></Button>
			
			<Button
				style={styles.input}
				onPress={this.onLogout}
				disabled={!Firebase.user}
			><Text>Logout</Text></Button>
			
			<Text>{Firebase.user ? Firebase.user.email : ''}</Text>
		</Container>;
	}
}


const styles = StyleSheet.create( {
	container: {
		flex:            1,
		alignItems:      'center',
		justifyContent:  'center',
		backgroundColor: '#ffffff'
	},
	input:     {
		width:        200,
		height:       44,
		padding:      10,
		borderWidth:  1,
		borderColor:  'black',
		marginBottom: 10,
		'alignSelf':  'center'
	}
} );
