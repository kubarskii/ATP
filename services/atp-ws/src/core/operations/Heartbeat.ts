import BaseOperation from './BaseOperation';
import { GeneratePayload, Operation } from '../../interfaces/operation.interface';
import { compose } from '../../utils/compose';
import { BindMethod } from '../../../../../lib/decorators/bindMethod.decorator';
import { getGMTTime } from '../../utils/time';
import { calculateSpeed } from '../../utils/speed';

const responseScheme = {};
const requestScheme = {};

export default class Heartbeat extends BaseOperation implements Operation, GeneratePayload {
  private response = {};

  private readonly value: any;

  constructor(value: any) {
    super(requestScheme, responseScheme, value);
    this.value = value;
    this.checkSpeed();
  }

  @BindMethod
  private checkSpeed() {
    if (!this.value.speed) {
      const { position, previousPosition, currentTime, previousTime } = this.value;
      this.value.speed = calculateSpeed(
        new Date(previousTime).getTime(),
        position[0],
        position[1],
        new Date(currentTime).getTime(),
        previousPosition[0],
        previousPosition[1],
      );
    }
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
  async generatePayload(): Promise<any> {
    await compose(this.getCurrentTime, this.getStatus)();
    return this.response;
  }
}
