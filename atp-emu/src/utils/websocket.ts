export function createWebSocket(config:any){
    const {url, protocols} = config
    const webSocket = new WebSocket(url, protocols);
    return webSocket
}