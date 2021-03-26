//import { start } from 'node:repl';
import React, { useContext } from 'react';
import './App.css';
import { WebSocketContext } from './index'

function App() {
  const ws: WebSocket = useContext(WebSocketContext);
  //console.log(ws)
  const testID = 33

  const sendStart = () => {
    const msg = [2, testID, "StartNotification",
      {
        beaconSerialNumber: "",
        imsi: "",
        iccid: "",
        firmwareVersion: "",
        vehicleVIN: "",          // optional
        vehicleLicensePlate: "", // optional
        vehicleBrand: "",        // optional 
        vehicleModel: "",        // optional
      }
    ]
    ws.send(JSON.stringify(msg))
    //get rate from response
    startHeartbeat(60)
  }

  const sendHeartbeat: any = (sendID: any) => {
    const msg = [2, sendID, 'Heartbeat', {
      speed: 10,
      position: ['60.1', '59.3'],   // latitude and longitude
      noSpeed: false,       // default,
      currentTime: new Date().toISOString(),      // GMT time ISOString
      previousTime: '',
      previousPosition: ['60.1', '59.3'],
      systemOfMeasures: 'km',
    }]
    ws.send(JSON.stringify(msg))
    console.log('sentHeartbeat');
  }

  const startHeartbeat: any = (heartbeatInterval: number) => {
    setInterval(():any => {sendHeartbeat(testID)},heartbeatInterval * 1000)
  }

  return (
    <div className="App">
      <button onClick={sendStart}>hui</button>
    </div>
  );
}

export default App;
