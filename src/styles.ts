import { StyleSheet } from 'react-native';
import { colors } from './config';

export const style = StyleSheet.create(
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
);

export const color = StyleSheet.create(
	{
		navigation: { backgroundColor: colors.navigation },
		background: { backgroundColor: colors.background },
		foreground: { color: colors.foreground },
		highlight:  { color: colors.highlight },
		listItem:   {
			backgroundColor:   colors.contrast,
			borderBottomWidth: 0.5
		}
	}
);
