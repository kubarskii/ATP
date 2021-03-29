// TODO separate to different files

export enum MessageType {
  CALL = 2,
  CALL_RESULT = 3,
  ERROR = 4
}

export type MessagePayload = {
  [key: string]: any,
}

export type ErrorDetails = {
  payload?: any,
  [key: string]: any,
}

export enum ErrorCode {
  NOT_SUPPORTED = "NotSupported",
  NOT_IMPLEMENTED = "NotImplemented",
  UNKNOWN = "Unknown",
}

export type AtpMessage = [MessageType, string, MessagePayload, MessagePayload | string, ErrorDetails]

export type Log = {
  type: MessageType,
  message: AtpMessage
}

export type Logs = {
  items: Log[]
}

export type Action = {
  type: string;
  payload: any;
}
