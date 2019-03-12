import { createAppContainer, createStackNavigator, createSwitchNavigator } from 'react-navigation';
import FolderListModal from '../pages/FolderList/FolderListModal';
import ItemSelector from '../pages/ItemSelector';
import LoginModal from '../pages/LoginModal';
import TimezoneSelector from '../pages/TimezoneSelector';
import MainTabNavigator from './MainTabNavigator';

const RootStack = createStackNavigator(
	{
		Main:            MainTabNavigator,
		Selector:        ItemSelector,
		FolderListModal: FolderListModal,
		Timezone:        TimezoneSelector,
		Login:           LoginModal
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
