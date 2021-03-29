export default class Client {
  public connection: any | undefined;

  public name: string | undefined;

  constructor(connection: any, name: string) {
    this.connection = connection;
    this.name = name;
  }
}
