/* eslint-disable unicorn/prevent-abbreviations */
import WebSocket from 'ws';
import Clients from './Clients';
import Connection from './Connection';
import { SUPPORTED_PROTOCOL } from '../config';
import Client from './Client';

const clients = new Clients();

export default class CentralSystem {
  private options: any = {};

  private readonly port: number = 9001;

  private wss: any | undefined;

  private bcnName: string | undefined;

  constructor(options: any) {
    if (options && Object.keys(options).length > 0) {
      this.options = options;
    }
  }

  listen(cb?: () => void) {
    const validateConnection = this.options.validateConnection || (() => true);
    this.options = {
      port: this.port,
      backlog: 100,
      /* handleProtocols: (protocols: string | any[], req: any) => {
                 if (protocols.indexOf(SUPPORTED_PROTOCOL) === -1) {
                     return '';
                 }
                 return SUPPORTED_PROTOCOL;
             }, */
      verifyClient: async (
        info: { req: { url: any } },
        callback: (argument0: any, argument1: number, argument2: string) => void,
      ) => {
        const isAccept = await validateConnection(info.req.url);
        callback(isAccept, 404, 'Central System does not recognize the charge point identifier in the URL path');
      },
      clientTracking: true,
      ...this.options,
    };
    const defFunction = () => {
      console.log('WS Server has just started');
    };
    const callback = cb || defFunction;
    this.wss = new WebSocket.Server(this.options, callback);

    this.wss.on('error', (ws: any, request: any) => {
      console.info(ws, request);
    });

    this.wss.on('upgrade', (ws: any, request: any) => {
      console.info(request);
    });

    this.wss.on('connection', this.onNewConnection);
  }

  onNewConnection(ws: any, request: any): void {
    this.bcnName = request.url.replace('/', '');
    ws.bcnName = this.bcnName;
    const connection = new Connection(ws, request);
    const client = new Client(connection);

    ws.on('error', (error: any) => {
      console.info(error, ws.readyState);
    });

    ws.on('close', (error: any) => {
      clients.deleteClient(client);
    });

    if (!ws.protocol) {
      // return ws.close();
    }

    clients.addClient(client);
  }
}
