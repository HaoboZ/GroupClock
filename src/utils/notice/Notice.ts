import { Notifications, Permissions } from 'expo';
import moment from 'moment-timezone';
import { Toast } from 'native-base';
import { Platform } from 'react-native';
import Settings from '../../screens/home/settings/Settings';
import store from '../../store/store';
import { noticeActions } from './noticeStore';

const interval = {
	minute: 60000,
	hour:   3600000,
	day:    86400000,
	week:   604800000,
	month:  2592000000,
	year:   31536000000
};

export default new class Notice {
	
	/**
	 * Creates android channel.
	 * Request permissions.
	 */
	public async init() {
		if ( Platform.OS === 'android' )
			await Notifications.createChannelAndroidAsync( 'default', {
				name:  'Default',
				sound: true
			} );
		
		if ( !store.getState().settings.permission ) {
			const { status } = await Permissions.getAsync( Permissions.USER_FACING_NOTIFICATIONS );
			Settings.permission( status );
		}
	}
	
	/**
	 * Creates a scheduled local and background notification.
	 *
	 * @param itemId - Id reference to save notification to.
	 * @param title - Message title text shown.
	 * @param body - Message body text shown.
	 * @param time - Time in ms until notification is shown.
	 * @param repeat - Standard duration string for time to repeat.
	 * @param onComplete - Called on notification completion.
	 */
	public async create( { itemId, title, body, time, repeat, onComplete }: {
		itemId: string
		title: string
		body: string
		time: number
		repeat?: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
		onComplete?: () => void
	} ) {
		if ( store.getState().notice[ itemId ] !== undefined )
			this.delete( itemId );
		
		let noticeId = await this.notice( {
			title,
			body,
			time: Date.now() + time,
			repeat
		} );
		let localId = await this.local( {
			itemId,
			title,
			body,
			time,
			repeat,
			onComplete
		} );
		store.dispatch( noticeActions.createNotice( itemId, noticeId, localId ) );
		console.log( 'creating', moment( Date.now() + time ).toString(), noticeId, localId );
	}
	
	/**
	 * Removes local and background notification.
	 *
	 * @param itemId - Id reference to delete.
	 */
	public delete( itemId: string ) {
		let noticeId = store.getState().notice[ itemId ];
		if ( !noticeId ) return;
		
		Notifications.cancelScheduledNotificationAsync( noticeId );
		let localId = store.getState().localNotice[ itemId ];
		clearTimeout( localId );
		store.dispatch( noticeActions.deleteNotice( itemId ) );
		console.log( 'deleting', noticeId, localId );
	}
	
	/**
	 * Creates background notification.
	 *
	 * @param title
	 * @param body
	 * @param time
	 * @param repeat
	 */
	private async notice( { title, body, time, repeat }: {
		title: string
		body: string
		time: number
		repeat?: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
	} ) {
		return await Notifications.scheduleLocalNotificationAsync( {
			title,
			body,
			ios:     {
				sound: true
			},
			android: <any>{
				channelId: 'default'
			}
		}, {
			time,
			repeat
		} ) as number;
	}
	/**
	 * Creates local notification.
	 *
	 * @param itemId
	 * @param title
	 * @param body
	 * @param time
	 * @param repeat
	 * @param onComplete
	 */
	private async local( { itemId, title, body, time, repeat, onComplete }: {
		itemId: string
		title: string
		body: string
		time: number
		repeat?: 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'
		onComplete?: () => void
	} ) {
		return setTimeout( async () => {
			Toast.show( {
				text:       title + '\n\t' + body,
				buttonText: 'Close',
				position:   'top',
				duration:   4000
			} );
			if ( repeat ) {
				let localId = await this.local( {
					itemId,
					title,
					body,
					time: interval[ repeat ],
					repeat
				} );
				store.dispatch( noticeActions.createNotice( itemId, undefined, localId ) );
			} else {
				store.dispatch( noticeActions.deleteNotice( itemId ) );
				onComplete();
			}
		}, time );
	}
	
};
