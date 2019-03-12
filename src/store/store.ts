import { applyMiddleware, createStore } from 'redux';
import { createTransform, persistReducer, persistStore } from 'redux-persist';
import { PersistConfig } from 'redux-persist/es/types';
import storage from 'redux-persist/lib/storage';
import promise from 'redux-promise-middleware';
import reducer from './reducers';

const middleware = applyMiddleware( promise() );

const persistConfig: PersistConfig = {
	key:        'root',
	storage,
	blacklist:  [ 'time', 'localNotice' ],
	transforms: [ createTransform(
		( state, key ) => {
			console.log( 'inbound ' + key );
			// send to firebase
			return state;
		},
		( state, key ) => {
			console.log( 'outbound ' + key );
			// check firebase for corresponding
			return state;
		},
		{
			blacklist: [ 'notice' ]
		}
	) ]
};

const persistedReducer = persistReducer( persistConfig, reducer );
const store = createStore( persistedReducer, middleware );
export default store;
export const persistor = persistStore( store );

export { state as AppState } from './reducers';
