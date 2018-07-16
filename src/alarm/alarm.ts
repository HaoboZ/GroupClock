import createNavigator from '../extend/createNavigator';

import AlarmList from './routes/alarmList';
import AddAlarm from './routes/addAlarm';
import EditAlarmGroup from './routes/editAlarmGroup';
import EditAlarm from './routes/editAlarm';

export default createNavigator(
	{
		AlarmList,
		AddAlarm,
		EditAlarmGroup,
		EditAlarm
	}
);
