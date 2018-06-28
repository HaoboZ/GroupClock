import React from 'react';
import { Text, View } from 'react-native';
import { createStackNavigator, NavigationInjectedProps, NavigationScreenOptions } from 'react-navigation';
import Icon, { IconButton } from '../components/nativeIcon';
import SwipeList from '../components/swipeList';
import moment from 'moment-timezone';

import addAlarm from './addAlarm';
import config, { colors } from '../config';

class Alarm extends React.PureComponent {
	
	props: NavigationInjectedProps;
	
	state = {
		data: []
	};
	
	static navigationOptions( { navigation }: NavigationInjectedProps ): NavigationScreenOptions {
		const title = navigation.getParam( 'title', 'Alarm' ),
				tz    = navigation.getParam( 'tz', moment.tz.guess() );
		
		return {
			title,
			headerBackTitle: 'Back',
			headerRight:     <IconButton
									  name='add'
									  onPress={() => navigation.navigate( 'addAlarm', { tz } )}
									  size={40}
									  color={colors.highlight}
								  />
		};
	}
	
	componentDidMount() {
		//TODO: Load data from asyncStorage to state.data
		this.setState( { data: Array( 3 ).fill( '' ).map( ( _, i ) => ( { text: `item #${i}` } ) ) } );
	}
	
	render() {
		return <SwipeList
			style={[ config.colors.background ]}
			data={this.state.data}
			renderItem={this.renderItem}
			rightButtons={[ {
				text: 'Pop', color: 'blue', onPress: () => {
					this.props.navigation.pop();
				}
			}, {
				text: 'Push', color: 'red', onPress: () => {
					this.props.navigation.push( 'Alarm', {
						title: 'Next Alarm',
						tz:    this.props.navigation.getParam( 'tz' )
					} );
				}
			} ]}
		/>;
	}
	
	private renderItem = ( item ) => {
		//TODO: Render each alarm
		return <View
			style={{
				borderColor:       colors.navigation,
				borderBottomWidth: 1,
				height:            50
			}}
		>
			<Text style={[ config.colors.text ]}>I am {item.text} in a SwipeListView</Text>
		</View>
	};
	
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
			headerStyle:          [ config.colors.navigation ],
			headerTitleStyle:     [ config.colors.text ],
			headerBackTitleStyle: [ config.colors.highlight ],
			headerBackImage:      <View style={config.styles.buttonPadding}>
											 <Icon
												 name='arrow-back'
												 color={colors.highlight}
												 size={30}
											 />
										 </View>
		}
	}
);
