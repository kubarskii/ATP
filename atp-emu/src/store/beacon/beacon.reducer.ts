import { Action } from "../../types";
import { BeaconActionTypes } from "./beacon.action-types.enum";

export type BeaconState = {
  isFetching: boolean;
  response: any;
  error: string;
  operationName: string;
}

const defaultState: BeaconState = {
  isFetching: false,
  response: "",
  error: "",
  operationName: ""
};

export const beaconReducer = (state: any = defaultState, action: Action): BeaconState => {
  const {
    type,
    payload
  } = action;

  switch (type) {
    case BeaconActionTypes.BEACON_REQUEST_SUCCESS:
      return {
        ...state,
        isFetching: false,
        error: "",
        response: payload.response
      };
    case BeaconActionTypes.BEACON_REQUEST_ERROR:
      return {
        ...state,
        error: payload.error,
        isFetching: false
      };
    case BeaconActionTypes.BEACON_REQUEST_PENDING:
      return {
        ...state,
        isFetching: true
      };
    case BeaconActionTypes.BEACON_REQUEST:
      return {
        ...state,
        operationName: payload.operationName
      };
    default:
      return state;
  }

};
