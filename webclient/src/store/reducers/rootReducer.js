import authReducer from "./authReducer";
import stateReducer from "./stateReducer";
import { combineReducers } from "redux"
import storage from "redux-persist/lib/storage"
import autoMergeLevel2 from "redux-persist/es/stateReconciler/autoMergeLevel2"
import persistReducer from "redux-persist/es/persistReducer";


const commonConfig = {
    storage,
    stateReconciler: autoMergeLevel2
}

const authConfig = {
    ...commonConfig,
    key: 'auth',
    whiteList: ['isLoggedIn', 'token']
}

const stateConfig = {
    ...commonConfig,
    key: 'state',
    whiteList: ['active']
}

const rootReducer = combineReducers({
    auth: persistReducer(authConfig, authReducer),
    state: persistReducer(stateConfig, stateReducer)
})


export default rootReducer