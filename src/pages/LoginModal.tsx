import { Body, Container, Header, Right, Title } from 'native-base';
import * as React from 'react';
import NavigationComponent from '../components/NavigationComponent';

export default class LoginModal extends NavigationComponent {
	
	render() {
		return <Container>
			{this.header()}
		</Container>;
	}
	
	private header() {
		return <Header>
			{this.goBack()}
			<Body><Title>Login</Title></Body>
			<Right/>
		</Header>;
	}
	
}
