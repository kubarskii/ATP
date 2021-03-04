interface Client {
    [key: string]: any,
}

class Clients {

    private _clientsMap: Map<any, Client> = new Map()

    constructor() {
    }

    addClient(key: any, client: Client): void {
        this._clientsMap.set(key, client);
    }

    getClient(key: any): Client | undefined {
        return this._clientsMap.get(key);
    }

    deleteClient(key: any): void {
        this._clientsMap.delete(key);
    }

    get clientsMap(): Map<any, Client>{
        return this._clientsMap;
    }

}

export default Clients;