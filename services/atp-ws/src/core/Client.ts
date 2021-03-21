export default class Client {
  private connection: any | undefined;

  constructor(connection: any) {
    this.connection = connection;
  }
}
