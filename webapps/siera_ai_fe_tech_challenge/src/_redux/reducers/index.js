import {combineReducers} from "redux";
import ErrorReducer from "./errorReducer";
import MockDataReducer from "./mockData";
import BetSlipReducer from "./betSlipReducer";

export default combineReducers({
    errors: ErrorReducer,
    mockdata: MockDataReducer,
    bets: BetSlipReducer
})
