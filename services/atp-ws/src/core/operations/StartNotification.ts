import BaseOperation from './BaseOperation';
import { GeneratePayload, Operation } from '../../interfaces/operation.interface';
import { getGMTTime } from '../../utils/time';
import { compose } from '../../utils/compose';
import { BindMethod } from '../../../../../lib/decorators/bindMethod.decorator';
import { db as database } from '../../index';

const requestScheme = require('./schemas/StartNotification.json');
const responseScheme = require('./schemas/StartNotificationResponse.json');

export default class StartNotification extends BaseOperation implements Operation, GeneratePayload {
  private response: any = {};

  private prevTime: any;

  private interval: any;

  private defaultInterval = 60;

  constructor(value: any) {
    super(requestScheme, responseScheme, value);
  }

  @BindMethod
  private getStatus() {
    this.response = { ...this.response, status: 'Accepted' };
  }

  @BindMethod
  private getCurrentTime() {
    this.response = { ...this.response, currentTime: getGMTTime() };
  }

  @BindMethod
  private async getHeartbeatInterval() {
    const interval = await this.getInterval();
    this.response = { ...this.response, interval: interval || this.defaultInterval };
  }

  @BindMethod
  async generatePayload() {
    await compose(this.getStatus, this.getHeartbeatInterval, this.getCurrentTime)();
    return this.response;
  }

  private async getInterval(): Promise<any> {
    if (!this.prevTime || this.prevTime - Date.now() < 60 * 60 * 1000) {
      this.prevTime = Date.now();
      this.interval = await database.get(['/interval']);
      return this.interval;
    }
    if (this.prevTime && this.prevTime - Date.now() > 60 * 60 * 1000) {
      return this.interval;
    }
    return null;
  }
}
