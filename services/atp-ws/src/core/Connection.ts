import { v4 as uuidv4 } from 'uuid';
import { CallMessage, CallResultMessage, ErrorMessage, validateParsedMessage } from '../utils/messageValidate';
import { MessageType } from '../enums/messageType.enum';
import { Operations } from './operations';
import BaseOperation from './operations/BaseOperation';
import { getObjectValues } from '../utils/validateAndApplyProperties';
import { db as database } from '../index';

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
      const ip =
        request && ((request.connection && request.connection.remoteAddress) || request.headers['x-forwarded-for']);
    }
    ws.on('message', (message: any) => this.onMessage(message));

    ws.on('error', (error: string) => {
      console.info(error);
    });
  }

  async onMessage(message: string) {
    const parsedMessage: CallMessage | CallResultMessage | ErrorMessage = JSON.parse(message);
    const valid: boolean = validateParsedMessage(parsedMessage);
    if (valid) {
      switch (parsedMessage[0]) {
        case MessageType.CALL:
          {
            const [type, id, operationName, payload] = parsedMessage;
            if (typeof operationName === 'string' && !Operations[operationName]) {
              this.sendErrorMessage([
                4,
                id,
                'NotSupported',
                'Operation is not supported by CS!',
                {
                  status: 'Rejected',
                  initialRequest: message,
                },
              ]);
              break;
            }
            const operation: any = typeof operationName === 'string' ? new Operations[operationName](payload) : null;
            if (!operation) {
              throw new Error('operationName is not a string');
            }
            const response = await operation.generatePayload();
            const validatedResponsePayload = operation.createResponse(response);
            const basePart = {
              beacon: this.ws.bcnName,
              time: Date.now(),
            };
            database.create([
              `/logs/${operationName}`,
              {
                ...basePart,
                message: {
                  type,
                  id,
                  operationName,
                  payload,
                },
              },
            ]);
            const res = getObjectValues(validatedResponsePayload);
            database.create([
              `/logs/${operationName}`,
              {
                ...basePart,
                message: {
                  type: 3,
                  id,
                  res,
                },
              },
            ]);
            this.ws.send(JSON.stringify([3, id, res]));
          }
          break;
        case MessageType.CALL_RESULT:
          // TODO find if the request was made
          // process the response: write to db, delete from response list
          {
            const [type, id, payload] = parsedMessage;
            if (this.requests[id]) {
              delete this.requests[id];
            }
          }
          break;
        case MessageType.ERROR:
          // if error throw exception
          break;
        default: {
          console.log('default action');
        }
      }
    } else {
      throw new Error('The message sent is not valid!');
    }
  }

  private onClose(): void {}

  public sendRequest(operationName: string, payload: any): void {
    const uuid = uuidv4();
    this.requests[uuid] = true;
    this.ws.send(JSON.stringify([2, uuidv4(), operationName, payload]));
  }

  private sendErrorMessage(message: ErrorMessage) {
    this.ws.send(JSON.stringify(message));
  }
}
