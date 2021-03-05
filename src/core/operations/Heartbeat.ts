import BaseOperation from "./BaseOperation";
import {GeneratePayload, Operation} from "../interfaces/operation.interface";
import {compose} from "../../utils/compose";
import {BindMethod} from "../../decorators/bindMethod.decorator";
import {getGMTTime} from "../../utils/time";

const resScheme = {};
const reqScheme = {};

export default class Heartbeat extends BaseOperation implements Operation, GeneratePayload{
    private response = {};

    constructor(value: any) {
        super(reqScheme, resScheme, value);
    }

    @BindMethod
    private getStatus() {
        this.response = {...this.response, status: 'Accepted'};
    }

    @BindMethod
    private getCurrentTime() {
        this.response = {...this.response, currentTime: getGMTTime()};
    }

    @BindMethod
    async generatePayload(): Promise<any> {
        await compose(this.getCurrentTime, this.getStatus)();
        return this.response;
    }


}