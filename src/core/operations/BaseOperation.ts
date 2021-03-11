import {Operation} from "../../interfaces/operation.interface";
import validateAndApplyProperties from "../../utils/validateAndApplyProperties";

const RESPONSE_SCHEMA_SYMBOL = Symbol('responseSchema');

export default class BaseOperation implements Operation {

    constructor(reqScheme: any, resScheme: any, value: any) {
        // @ts-ignore
        this[RESPONSE_SCHEMA_SYMBOL] = resScheme;
        validateAndApplyProperties(this, reqScheme, value);
    }

    getCommandName() {
        return this.constructor.name;
    }

    createResponse(payload: any) {
        const response: any = {};
        // @ts-ignore
        validateAndApplyProperties(response, this[RESPONSE_SCHEMA_SYMBOL], payload);
        return response;
    }

}