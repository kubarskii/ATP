/* Non-SSL is simply App() */
import {DEDICATED_COMPRESSOR_3KB, HttpRequest, HttpResponse, WebSocket} from "uWebSockets.js";
import Clients from './Clients'

const clients = new Clients();
require('uWebSockets.js').App().ws('/*', {

    /* There are many common helper features */
    idleTimeout: 30,
    maxBackpressure: 1024,
    maxPayloadLength: 512,
    compression: DEDICATED_COMPRESSOR_3KB,

    open: (ws: WebSocket) => {
    },
    /* For brevity we skip the other events (upgrade, open, ping, pong, close) */
    message: (ws: WebSocket, message: ArrayBuffer, isBinary: boolean) => {
        /* You can do app.publish('sensors/home/temperature', '22C') kind of pub/sub as well */
        /* Here we echo the message back, using compression if available */
        clients.addClient(ws, ws);
        console.log(clients.getClient(ws));
        let ok = ws.send(message, isBinary, true);
    }

}).get('/*', (res: HttpResponse, req: HttpRequest) => {

    /* It does Http as well */
    res.writeStatus('200 OK').writeHeader('IsExample', 'Yes').end('Hello there!');

}).listen(9001, (listenSocket: any) => {

    if (listenSocket) {
        console.log('Listening to port 9001');
    }

});