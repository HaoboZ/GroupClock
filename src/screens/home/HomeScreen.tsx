import { Body, Button, Container, Header, Left, Right, Text, Title } from 'native-base';
import * as React from 'react';
import Icon from '../../components/Icon';
import NavigationComponent from '../../components/NavigationComponent';

export default class HomeScreen extends NavigationComponent {
	
	public componentDidMount(): void {
	}
	
	render() {
		return <Container>
			{this.header()}
			<Text>Will show list of active parts sorted by time</Text>
		</Container>;
	}
	
	private header() {
		return <Header>
			<Left/>
			<Body><Title>Header</Title></Body>
			<Right>
				<Button transparent onPress={() => {
					this.props.navigation.navigate( 'Settings' );
				}}>
					<Icon name='settings'/>
				</Button>
			</Right>
		</Header>;
	}
	
}
