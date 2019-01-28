import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import FolderListModal from '../pages/FolderList/FolderListModal';
import TimezoneSelector from '../pages/TimezoneSelector';
import MainTabNavigator from './MainTabNavigator';

const RootStack = createStackNavigator(
	{
		Main:            MainTabNavigator,
		FolderListModal: FolderListModal,
		Timezone:        TimezoneSelector
	},
	{
		mode:       'modal',
		headerMode: 'none'
	}
);

export default createAppContainer( createSwitchNavigator( {
	// You could add another route here for authentication.
	
	Root: RootStack
} ) );
