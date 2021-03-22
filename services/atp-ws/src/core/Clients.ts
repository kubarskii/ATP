// @ts-ignore
import { Singleton } from '../../../../lib/decorators/singleton.decorator';
// @ts-ignore
import { BindMethod } from '../../../../lib/decorators/bindMethod.decorator';

export interface Client {
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
