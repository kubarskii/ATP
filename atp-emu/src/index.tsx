import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {createWebSocket} from './utils/websocket'
const config = {url: "ws://localhost:9001/", protocols: "atp0.1"}
export const WebSocketContext:any = React.createContext(null);

ReactDOM.render(
  <WebSocketContext.Provider value={createWebSocket(config)}>
  <App />
</WebSocketContext.Provider>,
  document.getElementById('root')
);