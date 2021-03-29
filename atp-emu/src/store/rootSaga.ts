import { all } from "redux-saga/effects";
import { watchBeaconRequest } from "./beacon/beacon.saga";

export default function* rootSaga() {
  yield all([watchBeaconRequest()]);
}
