// @flow

import variable from "./../variables/platform";

export default (variables /*: * */ = variable) => {
	const accordionTheme = {
		headerStyle:          variables.headerStyle,
		iconStyle:            variables.iconStyle,
		contentStyle:         variables.contentStyle,
		expandedIconStyle:    variables.expandedIconStyle,
		accordionBorderColor: variables.accordionBorderColor
	};
	
	return accordionTheme;
};
