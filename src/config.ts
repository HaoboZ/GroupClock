import { StyleSheet } from 'react-native';

export const colors = {
	navigation: '#2b2b2b',
	background: '#313335',
	text:       '#ffffff',
	highlight:  '#00ff00',
	item:       '#555555'
};

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
	colors: StyleSheet.create(
		{
			navigation: { backgroundColor: colors.navigation },
			background: { backgroundColor: colors.background },
			text:       { color: colors.text },
			highlight:  { color: colors.highlight },
			item:       { backgroundColor: colors.item }
		}
	)
}
