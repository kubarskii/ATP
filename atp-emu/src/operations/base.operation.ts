export default class BaseOperation {
  private req;
  private res;

  constructor(req: any, res: any) {
    this.req = req;
    this.res = res;
  }

  generatePayload(){

  }

}
