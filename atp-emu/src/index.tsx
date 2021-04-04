import React from "react";
import ReactDOM from "react-dom";
import { createWebSocket } from "./utils/websocket";
import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter, Link, Route } from "react-router-dom";
import Home from "./pages/home/home.component";
import Map from "./pages/map/map.component";

const config = {
  url: "ws://localhost:9001/bcn1",
  protocols: "atp0.1"
};
export const WebSocketContext: any = React.createContext(null);

ReactDOM.render(
  <Provider store={store}>
    <WebSocketContext.Provider value={createWebSocket(config)}>
      <BrowserRouter>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/map">Map</Link>
            </li>
          </ul>
        </nav>
        <div>
          <Route exact path="/" component={Home} />
          <Route path="/map" component={Map} />
        </div>
      </BrowserRouter>
    </WebSocketContext.Provider>
  </Provider>,
  document.getElementById("root")
);
