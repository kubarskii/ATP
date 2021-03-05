import {Singleton} from "../decorators/singleton.decorator";
import {BindMethod} from "../decorators/bindMethod.decorator";

export interface Client {
    [key: string]: any,
}

@Singleton
class Clients {

    private _clientsMap: Array<Client> = new Array<Client>()

    constructor() {
    }

    @BindMethod
    addClient(client: Client): void {
        this._clientsMap.push(client);
    }

    @BindMethod
    getClient(client: Client): Client | undefined {
        const index = this._clientsMap.indexOf(client);
        return this._clientsMap[index];
    }

    @BindMethod
    deleteClient(client: Client): void {
        const index = this._clientsMap.indexOf(client);
        this._clientsMap.splice(index, 1);
    }

    @BindMethod
    get clientsMap(): Array<Client> {
        return this._clientsMap;
    }

}

export default Clients;