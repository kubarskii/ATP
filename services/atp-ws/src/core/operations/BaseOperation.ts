import { Operation } from '../../interfaces/operation.interface';
import validateAndApplyProperties from '../../utils/validateAndApplyProperties';

const RESPONSE_SCHEMA_SYMBOL = Symbol('responseSchema');

export default class BaseOperation implements Operation {
  constructor(requestSchema: unknown, responseSchema: unknown, value: unknown) {
    // @ts-ignore
    this[RESPONSE_SCHEMA_SYMBOL] = responseSchema;
    validateAndApplyProperties(this, requestSchema, value);
  }

  getCommandName(): string {
    return this.constructor.name;
  }

  createResponse(payload: any) {
    const response: any = {};
    // @ts-ignore
    validateAndApplyProperties(response, this[RESPONSE_SCHEMA_SYMBOL], payload);
    return response;
  }
}
