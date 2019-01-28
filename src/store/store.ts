import { applyMiddleware, createStore } from 'redux';
import { persistReducer, persistStore } from 'redux-persist';
import { PersistConfig } from 'redux-persist/es/types';
import storage from 'redux-persist/lib/storage';
import promise from 'redux-promise-middleware';
import reducer from './reducers';

const middleware = applyMiddleware( promise() );

const persistConfig: PersistConfig = {
	key:       'root',
	storage,
	blacklist: [ 'localNotice' ]
};

const persistedReducer = persistReducer( persistConfig, reducer );
const store = createStore( persistedReducer, middleware );
export default store;
export const persistor = persistStore( store );

export { state as AppState } from './reducers';
