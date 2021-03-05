import WebSocket from 'ws';
import Clients from "./Clients";
import Connection from "./Connection";

const clients = new Clients();

class Client {
    private connection: Connection | undefined;

    constructor(connection: Connection) {
        this.connection = connection;
    }
}

export default class CentralSystem {

    private options: any | {} = {};
    private readonly port: number = 9001;
    private wss: any | undefined;
    private ATP_PROTOCOL_VERSION: string = 'atp0.1';

    constructor(opts: any) {
        if (opts && Object.keys(opts).length) {
            this.options = opts;
        }
    }

    listen() {
        const validateConnection = this.options.validateConnection || (() => true);
        this.options = {
            port: this.port,
            backlog: 100,
            // handleProtocols: (protocols: string | any[], req: any) => {
            //     if (protocols.indexOf(this.ATP_PROTOCOL_VERSION) === -1) {
            //         return '';
            //     }
            //     return this.ATP_PROTOCOL_VERSION;
            // },
            verifyClient: async (info: { req: { url: any; } }, cb: (arg0: any, arg1: number, arg2: string) => void) => {
                const isAccept = await validateConnection(info.req.url);
                cb(isAccept, 404, 'Central System does not recognize the charge point identifier in the URL path');
            },
            clientTracking: true,
            ...this.options,
        }
        this.wss = new WebSocket.Server(this.options);

        this.wss.on('error', (ws: any, req: any) => {
            console.info(ws, req);
        });

        this.wss.on('upgrade', (ws: any, req: any) => {
            console.info(req);
        });

        this.wss.on('connection', this.onNewConnection);

    }

    onNewConnection(ws: any, req: any) {
        ws.on('error', (err: any) => {
            console.info(err, ws.readyState);
        });

        if (!ws.protocol) {
            //return ws.close();
        }

        const connection = new Connection(ws, req);
        const client = new Client(connection);

        ws.on('close', (err: any) => {
            clients.deleteClient(client);
        });

        clients.addClient(client);
        setTimeout(() => {
            console.log(clients);
            console.log(clients.getClient(connection));
            ;
        }, 3000)
    }

}