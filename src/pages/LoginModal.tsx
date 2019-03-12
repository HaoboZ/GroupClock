import * as firebase from 'firebase';
import { Body, Button, Container, Header, Right, Title } from 'native-base';
import * as React from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';
import NavigationComponent from '../components/NavigationComponent';
import fb from '../screens/home/settings/firebaseUser';

export default class LoginModal extends NavigationComponent {
	
	state = {
		password: '',
		email:    ''
	};
	
	componentDidMount() {
		console.log( !!fb.user );
	}
	
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
		firebase.auth().signOut();
		this.props.navigation.goBack();
	};
	
	onLogin = () => {
		firebase.auth().signInWithEmailAndPassword( this.state.email, this.state.password )
			.then( () => {
			}, ( error ) => {
				Alert.alert( error.message );
				console.log( error.message );
			} );
		this.props.navigation.goBack();
	};
	
	onSignup = () => {
		firebase.auth().createUserWithEmailAndPassword( this.state.email, this.state.password )
			.then( () => {
			}, ( error ) => {
				Alert.alert( error.message );
				console.log( error.message );
			} );
		
	};
	
	login() {
		return <View style={styles.container}>
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
				disabled={!!fb.user}
			>Sign up</Button>
			
			<Button
				style={styles.input}
				onPress={this.onLogin}
				disabled={!!fb.user}
			>Login</Button>
			
			<Button
				style={styles.input}
				onPress={this.onLogout}
				disabled={!fb.user}
			>Logout</Button>
			
			<Text>{fb.user ? fb.user.email : ''}</Text>
		</View>;
	}
}


const styles = StyleSheet.create( {
	container: {
		flex:            1,
		alignItems:      'center',
		justifyContent:  'center',
		backgroundColor: '#d6ffd6'
	},
	input:     {
		width:        200,
		height:       44,
		padding:      10,
		borderWidth:  1,
		borderColor:  'black',
		marginBottom: 10
	}
} );
