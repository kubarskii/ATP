import { combineReducers } from "redux";
import { logsReducer } from "./logs/logs.reducer";
import { beaconReducer } from "./beacon/beacon.reducer";

export const rootReducer = combineReducers({
  logs: logsReducer,
  beacon: beaconReducer
});
