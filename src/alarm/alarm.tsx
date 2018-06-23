import React from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator, NavigationInjectedProps, NavigationScreenOptions } from 'react-navigation';
import Icon, { IconButton } from '../components/nativeIcon';
import SwipeList from '../components/swipeList';

import addAlarm from './addAlarm';
import config from '../config';

class Alarm extends React.PureComponent {
	
	props: NavigationInjectedProps;
	
	public state = {
		data: []
	};
	
	static navigationOptions( { navigation }: NavigationInjectedProps ): NavigationScreenOptions {
		const title = navigation.getParam( 'title' ) || 'Alarm';
		
		return {
			title,
			headerBackTitle: 'Back',
			headerRight:     <IconButton
									  name='add'
									  onPress={() => navigation.navigate( 'addAlarm' )}
									  size={40}
									  color={config.colors.highlight}
								  />
		};
	}
	
	componentDidMount() {
		//TODO: Load data from asyncStorage to state.data
		this.setState( { data: Array( 3 ).fill( '' ).map( ( _, i ) => ( { text: `item #${i}` } ) ) } );
	}
	
	renderItem( item ) {
		//TODO: Render each alarm
		return <View
			style={{
				borderColor:       config.colors.navigation,
				borderTopWidth:    0.25,
				borderBottomWidth: 0.25,
				height:            50
			}}
		>
			<Text>I am {item.text} in a SwipeListView</Text>
		</View>
	}
	
	render() {
		return <SwipeList
			data={this.state.data}
			renderItem={this.renderItem.bind( this )}
			rightButtons={[ {
				text: 'Pop', color: 'blue', onPress: () => {
					this.props.navigation.pop();
				}
			}, {
				text: 'Push', color: 'red', onPress: () => {
					this.props.navigation.push( 'Alarm', { title: 'Next Alarm' } );
				}
			} ]}
		/>;
	}
	
}

//TODO: Change stack navigator to include modal view to addAlarm
export default createStackNavigator(
	{
		Alarm:    Alarm,
		addAlarm: addAlarm
	},
	{
		initialRouteName:  'Alarm',
		navigationOptions: {
			headerStyle:          {
				backgroundColor: config.colors.navigation
			},
			headerTitleStyle:     {
				color: config.colors.text
			},
			headerBackTitleStyle: {
				color: config.colors.highlight
			},
			headerBackImage:      <View style={config.styles.buttonPadding}>
											 <Icon
												 name='arrow-back'
												 color={config.colors.highlight}
												 size={30}
											 />
										 </View>
		}
	}
);
