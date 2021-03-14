import {
    CallMessage,
    CallResultMessage,
    ErrorMessage,
    validateParsedMessage
} from "../utils/messageValidate";
import {MessageType} from "../enums/messageType.enum";
import {Operations} from "./operations";
import BaseOperation from "./operations/BaseOperation";
import {getObjectValues} from "../utils/validateAndApplyProperties";
import {db} from "../index";

export default class Connection {

    private ws: any | undefined;
    private req: any | undefined;
    private url: string = 'SERVER';

    constructor(ws: any, req: any) {
        this.ws = ws;
        if (req) {
            this.req = req;
            this.url = req && req.url;
            const ip = req && ((req.connection && req.connection.remoteAddress) || req.headers['x-forwarded-for']);
        }
        ws.on('message', (msg: any) => this.onMessage(msg));

        ws.on('error', (err: string) => {
            console.info(err);
        });
    }

    async onMessage(msg: string) {
        let parsedMessage: CallMessage;
        parsedMessage = JSON.parse(msg);
        const valid: boolean = validateParsedMessage(parsedMessage);
        if (valid) {
            switch (parsedMessage[0]) {
                case (MessageType.CALL):
                    const [type, id, operationName, payload]: CallMessage = parsedMessage;
                    if (!Operations[operationName]) {
                        this.sendErrorMessage([4, id, 'NotSupported', 'Operation is not supported by CS!', {
                            status: 'Rejected',
                            initialRequest: msg
                        }]);
                        break;
                    }
                    const operation: any = new Operations[operationName](payload);
                    const response = await operation.generatePayload();
                    const validatedResponsePayload = operation.createResponse(response);
                    const basePart = {
                        beacon: this.ws.bcnName,
                        time: Date.now(),
                    }
                    db.create([`/logs/${operationName}`, {
                        ...basePart,
                        message: {
                            type,
                            id,
                            operationName,
                            payload
                        }
                    }]);
                    const res = getObjectValues(validatedResponsePayload);
                    db.create([`/logs/${operationName}`, {
                        ...basePart,
                        message: {
                            type: 3,
                            id,
                            res
                        }
                    }]);
                    this.ws.send(JSON.stringify([3, id, res]))
                    break;
                default: {
                    console.log('default action');
                }
            }
        } else {
            throw new Error('The message sent is not valid!');
        }
    }

    onClose() {

    }

    private sendErrorMessage(msg: ErrorMessage) {
        this.ws.send(JSON.stringify(msg));
    }

}