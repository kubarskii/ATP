import React from "react";
import ReactDOM from "react-dom";
import AppComponent from "./components/app/app.component";
import { createWebSocket } from "./utils/websocket";
import { Provider } from "react-redux";
import { store } from "./store";

const config = {
  url: "ws://localhost:9001/bcn1",
  protocols: "atp0.1"
};
export const WebSocketContext: any = React.createContext(null);

ReactDOM.render(
  <Provider store={store}>
    <WebSocketContext.Provider value={createWebSocket(config)}>
      <AppComponent />
    </WebSocketContext.Provider>
  </Provider>,
  document.getElementById("root")
);
