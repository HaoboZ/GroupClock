import { StyleSheet } from 'react-native';
import { colors } from './config';

export const style = StyleSheet.create(
	{
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
	}
);

export const color = StyleSheet.create(
	{
		navigation: { backgroundColor: colors.navigation },
		background: { backgroundColor: colors.background },
		foreground: { color: colors.foreground },
		highlight:  { color: colors.highlight },
		listItem:   { backgroundColor: colors.contrast }
	}
);
