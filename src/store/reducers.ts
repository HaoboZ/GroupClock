import { combineReducers } from 'redux';
import folderList, { folderListState } from '../pages/FolderList/folderListStore';
import alarm, { alarmState } from '../screens/alarm/alarmStore';
import settings, { settingsState } from '../screens/home/settings/settingsStore';
import stopwatch, { watchState } from '../screens/stopwatch/watchStore';
import timer, { timerState } from '../screens/timer/timerStore';
import notice, { localNoticeStore, noticeState } from '../utils/notice/noticeStore';

export default combineReducers( {
	time() {
		return Date.now();
	},
	notice,
	localNotice: localNoticeStore,
	settings,
	folderList,
	alarm,
	stopwatch,
	timer
} );

export type state = {
	time: number
	notice: noticeState
	localNotice: noticeState
	settings: settingsState
	folderList: folderListState
	alarm: alarmState
	stopwatch: watchState
	timer: timerState
};