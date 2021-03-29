import { BeaconActionTypes } from "./beacon.action-types.enum";

export const sendRequest = (operationName: string) => ({
  type: BeaconActionTypes.BEACON_REQUEST,
  payload: { operationName }
});

export const requestSuccess = (response: any) => ({
  type: BeaconActionTypes.BEACON_REQUEST_SUCCESS,
  payload: { response }
});

export const requestPending = () => ({
  type: BeaconActionTypes.BEACON_REQUEST_PENDING
});

export const requestError = (error: any) => ({
  type: BeaconActionTypes.BEACON_REQUEST_ERROR,
  payload: { error }
});
