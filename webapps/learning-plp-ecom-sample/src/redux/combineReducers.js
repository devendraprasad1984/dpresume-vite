import {combineReducers} from "redux";
import * as appReducer from "./reducers/appReducer";

const rootReducer = combineReducers({
    filters: appReducer.filterReducer,
    toggleLeftPanel: appReducer.toggleLeftPanel
})

export default rootReducer