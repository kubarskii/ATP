import BaseOperation from "./BaseOperation";
import {GeneratePayload, Operation} from "../../interfaces/operation.interface";
import {getGMTTime} from "../../utils/time";
import {compose} from "../../utils/compose";
import {BindMethod} from "../../decorators/bindMethod.decorator";
import {db} from "../../index";

const reqScheme = require('./schemas/StartNotification.json');
const resScheme = require('./schemas/StartNotificationResponse.json');

export default class StartNotification extends BaseOperation implements Operation, GeneratePayload {
    private response: any = {};
    private prevTime: any;
    private interval: any;

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
        const interval = await this.getInterval()
        this.response = {...this.response, interval: interval}
    }

    @BindMethod
    async generatePayload() {
        await compose(this.getStatus, this.getHeartbeatInterval, this.getCurrentTime)();
        return this.response;
    }

    async getInterval() {
        if (!this.prevTime || ((this.prevTime - Date.now()) < (60 * 60 * 1000))) {
            this.prevTime = Date.now()
            this.interval = await db.get(['/interval']);
            return this.interval;
        } else if (this.prevTime && ((this.prevTime - Date.now()) > (60 * 60 * 1000))) {
            return this.interval
        }
    }

}