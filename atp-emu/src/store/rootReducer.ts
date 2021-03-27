import { combineReducers } from "redux";
import { logsReducer } from "./logs/logs.reducer";

export const rootReducer = combineReducers({ logs: logsReducer });