import { put, takeEvery, call } from "redux-saga/effects";
import { BeaconActionTypes } from "./beacon.action-types.enum";
import { requestError, requestPending, requestSuccess, sendRequest } from "./beacon.actions";

const getUser = (): Promise<any> => {
  return fetch("http://localhost:3080/client/bcn1", { method: "POST" })
    .then(res => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error(res.statusText);
      }
    });
};

export function* incrementAsync() {
  try {
    yield put(requestPending());
    // @ts-ignore
    const data = yield call(getUser);
    yield put(requestSuccess(data));
  } catch (e) {
    yield put(requestError(e));
  }
}

// Our watcher Saga: spawn a new incrementAsync task on each INCREMENT_ASYNC
export function* watchBeaconRequest() {
  yield takeEvery(BeaconActionTypes.BEACON_REQUEST, incrementAsync);
}
