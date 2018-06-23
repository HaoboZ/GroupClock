import { StyleSheet } from 'react-native';

export default {
	styles: StyleSheet.create(
		{
			flex:          {
				flex: 1
			},
			center:        {
				justifyContent: 'center',
				alignItems:     'center'
			},
			buttonPadding: {
				paddingLeft:  10,
				paddingRight: 10
			}
		}
	),
	colors:  {
		navigation: '#2b2b2b',
		background: '#313335',
		text:       '#ffffff',
		highlight:  '#00ff00'
	}
}