import { v4 as uuidv4 } from 'uuid';
import {
  CallMessage, CallResultMessage, ErrorMessage, validateParsedMessage,
} from '../utils/messageValidate';
import { MessageType } from '../enums/messageType.enum';
import { Operations } from './operations';
import BaseOperation from './operations/BaseOperation';
import { getObjectValues } from '../utils/validateAndApplyProperties';

export default class Connection {
  private ws: any | undefined;

  private req: any | undefined;

  private url = 'SERVER';

  private requests: any = {};

  constructor(ws: any, request: any) {
    this.ws = ws;
    if (request) {
      this.req = request;
      this.url = request && request.url;
      const ip = request && ((request.connection && request.connection.remoteAddress) || request.headers['x-forwarded-for']);
    }
    ws.on('message', (message: any) => this.onMessage(message));

    ws.on('error', (error: string) => {
      console.info(error);
    });
  }

  async onMessage(message: string) {
    const parsedMessage: CallMessage | CallResultMessage | ErrorMessage = JSON.parse(message);
    const [
      type,
      id,
      actionNameOrPayloadOrErrorCode,
      payloadOrErrorDescription,
      errorDetails,
    ] = parsedMessage;
    switch (type) {
      case MessageType.CALL:
        try {
          if (typeof actionNameOrPayloadOrErrorCode === 'string' && !Operations[actionNameOrPayloadOrErrorCode]) {
            this.sendErrorMessage([
              id,
              'NotSupported',
              'Operation is not supported by CS!',
              {
                status: 'Rejected',
              },
            ]);
            break;
          }
          const operation: any = typeof actionNameOrPayloadOrErrorCode === 'string'
            ? new Operations[actionNameOrPayloadOrErrorCode](payloadOrErrorDescription)
            : null;
          if (!operation) {
            this.sendErrorMessage([
              id,
              'Unknown',
              "Operation wasn't found",
              {
                status: 'Rejected',
              },
            ]);
            break;
          }

          const response = await operation.generatePayload();
          const validatedResponsePayload = operation.createResponse(response);
          const basePart = {
            beacon: this.ws.bcnName,
            time: Date.now(),
          };
          const res = getObjectValues(validatedResponsePayload);

          this.ws.send(JSON.stringify([3, id, res]));
        } catch (e) {
          this.sendErrorMessage([id, 'Unknown', e.toString(), {
            stasus: 'Rejected',
          }]);
        }
        break;
      case MessageType.CALL_RESULT:
        // TODO find if the request was made
        // process the response: write to db, delete from response list
        if (this.requests[id]) {
          delete this.requests[id];
        }

        break;
      case MessageType.ERROR:
        // if error throw exception
        break;
      default: {
        console.log('default action');
      }
    }
  }

  private onClose(): void {
  }

  public sendRequest(operationName: string, payload: any): void {
    const uuid = uuidv4();
    this.requests[uuid] = true;
    this.ws.send(JSON.stringify([2, uuidv4(), operationName, payload]));
  }

  private sendErrorMessage(message: any[]) {
    this.ws.send(JSON.stringify([4, ...message]));
  }
}
