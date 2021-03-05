import BaseOperation from "./BaseOperation";
import {GeneratePayload, Operation} from "../interfaces/operation.interface";
import {getGMTTime} from "../../utils/time";
import {compose} from "../../utils/compose";
import {BindMethod} from "../../decorators/bindMethod.decorator";

const reqScheme = require('./schemas/StartNotification.json');
const resScheme = require('./schemas/StartNotificationResponse.json');

export default class StartNotification extends BaseOperation implements Operation, GeneratePayload {
    private response: any = {};

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
    private async getHeartbeatInterval() {
        //TODO connect to db and get hbInterval
        const p = new Promise((res) => {
            setTimeout(() => {
                res(60);
            }, 300)
        })
        this.response = {...this.response, interval: await p}
    }

    @BindMethod
    async generatePayload() {
        await compose(this.getStatus, this.getHeartbeatInterval, this.getCurrentTime)();
        return this.response;
    }

}