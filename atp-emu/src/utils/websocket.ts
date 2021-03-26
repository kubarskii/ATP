export function createWebSocket(config:any){
    const {url, protocols} = config
    const webSocket = new WebSocket(url, protocols);
    //console.log('ye')
    webSocket.addEventListener('message', (event:any) =>{
        //console.log(JSON.parse(event.data));
    })
    return webSocket
}