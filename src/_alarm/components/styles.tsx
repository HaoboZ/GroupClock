import { StyleSheet } from 'react-native';
import { colors } from '../../config';

export default StyleSheet.create(
	{
		Item:      {
			height:          64,
			paddingTop:      0,
			paddingBottom:   0,
			paddingLeft:     20,
			paddingRight:    20,
			backgroundColor: colors.background
		},
		innerItem: {
			width:  210,
			margin: 0
		}
	}
);
