import WebSocket from 'ws';
import Clients from "./Clients";
import Connection from "./Connection";
import {SUPPORTED_PROTOCOL} from "../config";

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
    private bcnName: string | undefined;

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
            //     if (protocols.indexOf(SUPPORTED_PROTOCOL) === -1) {
            //         return '';
            //     }
            //     return SUPPORTED_PROTOCOL;
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
        this.bcnName = req.url.replace('/', '');
        ws.bcnName = this.bcnName;
        const connection = new Connection(ws, req);
        const client = new Client(connection);

        ws.on('error', (err: any) => {
            console.info(err, ws.readyState);
        });

        ws.on('close', (err: any) => {
            clients.deleteClient(client);
        });

        if (!ws.protocol) {
            //return ws.close();
        }

        clients.addClient(client);
    }

}