import { Singleton } from '../decorators/singleton.decorator';
import { BindMethod } from '../decorators/bindMethod.decorator';
import Connection from './Connection';

export interface Client {
  connection: Connection,
  name: string,
  [key: string]: any;
}

@Singleton
class Clients {
  private $clientsMap: Array<Client> = new Array<Client>();

  @BindMethod
  addClient(client: Client): void {
    this.$clientsMap.push(client);
  }

  @BindMethod
  getClient(client: Client): Client | undefined {
    const index = this.$clientsMap.indexOf(client);
    return this.$clientsMap[index];
  }

  @BindMethod
  getClientByName(name: string): Client | undefined {
    const index = this.$clientsMap.findIndex((el) => el.name === name);
    return this.$clientsMap[index];
  }

  @BindMethod
  deleteClient(client: Client): void {
    const index = this.$clientsMap.indexOf(client);
    this.$clientsMap.splice(index, 1);
  }

  @BindMethod
  get clientsMap(): Array<Client> {
    return this.$clientsMap;
  }
}

export default Clients;
