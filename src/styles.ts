import { StyleSheet } from 'react-native';
import { theme } from './config';

export const contentStyle = StyleSheet.create( {
	flex:          {
		flex: 1
	},
	row:           {
		flexDirection: 'row'
	},
	column:        {
		flexDirection: 'column'
	},
	center:        {
		justifyContent: 'center',
		alignItems:     'center'
	},
	centerSelf:    {
		alignSelf: 'center'
	},
	space:         {
		justifyContent: 'space-between'
	},
	buttonPadding: {
		paddingLeft:  10,
		paddingRight: 10
	}
} );

export const themeStyle = StyleSheet.create( {
	navigation: { backgroundColor: theme.navigation },
	background: { backgroundColor: theme.background },
	foreground: { color: theme.foreground },
	highlight:  { color: theme.highlight },
	listItem:   { backgroundColor: theme.contrast }
} );
