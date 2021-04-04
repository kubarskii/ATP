import React, { useContext, useEffect } from "react";
import Logs from "../../components/logs/logs.component";
import { WebSocketContext } from "../../index";
import { connect, useDispatch } from "react-redux";
import { AtpMessage, MessageType } from "../../types";
import { addLogs } from "../../store/logs/logs.actions";
import { v4 as uuidv4 } from "uuid";
import { sendRequest } from "../../store/beacon/beacon.actions";
import { withRouter } from "react-router";

let prevAction: null | { action: string, id: string } = null;
const setPrevAction: any = (data: { action: string, id: string }) => {
  prevAction = data;
};

let canMakeRequest: boolean = true;
const setCanMakeRequest: any = (value: boolean) => {
  canMakeRequest = value;
};

let prevTime: string | undefined;

function Home(props: any) {
  const ws: WebSocket = useContext(WebSocketContext);
  const dispatch = useDispatch();

  const processMessage = (message: AtpMessage) => {
    const [messageType, id, payload]: AtpMessage = message;
    if (messageType === MessageType.CALL_RESULT) {
      if (prevAction && (id === prevAction.id)) {
        setCanMakeRequest(true);
      }
      if (prevAction && prevAction.action === "StartNotification") {
        startHeartbeat(payload.interval);
      }

    }
  };

  const fn = (messsage: any) => {
    const parsedMessage = JSON.parse(messsage.data);
    processMessage(parsedMessage);
    dispatch(addLogs({
      type: MessageType[parsedMessage[0]],
      message: parsedMessage
    }));
  };

  useEffect(() => {
    ws.addEventListener("message", fn);
    return () => {
      ws.removeEventListener("message", fn);
    };
  }, []);

  const sendStart = () => {
    const id = uuidv4();
    const message = [2, id, "StartNotification",
      {
        beaconSerialNumber: "",
        imsi: "",
        iccid: "",
        firmwareVersion: "",
        vehicleVIN: "",          // optional
        vehicleLicensePlate: "", // optional
        vehicleBrand: "",        // optional
        vehicleModel: ""        // optional
      }
    ];
    ws.send(JSON.stringify(message));
    setPrevAction({
      action: "StartNotification",
      id
    });
    dispatch(addLogs({
      type: MessageType[MessageType.CALL],
      message
    }));
    setCanMakeRequest(false);
  };

  const sendHeartbeat: any = () => {
    const id = uuidv4();
    const time = new Date().toISOString();
    const message = [2, id, "Heartbeat", {
      speed: 10,
      position: ["60.1", "59.3"],   // latitude and longitude
      noSpeed: false,       // default,
      currentTime: time,      // GMT time ISOString
      previousTime: prevTime || time,
      previousPosition: ["60.1", "59.3"],
      systemOfMeasures: "km"
    }];
    ws.send(JSON.stringify(message));
    prevTime = time;
    dispatch(addLogs({
      type: MessageType[MessageType.CALL],
      message
    }));
    setPrevAction({
      action: "Heartbeat",
      id
    });
    setCanMakeRequest(false);
  };

  const startHeartbeat = (hbInterval: number): NodeJS.Timeout => {
    const interval = setInterval((): any => {
      if (canMakeRequest) {
        sendHeartbeat(uuidv4());
      }
    }, hbInterval);
    return interval;
  };

  return (
    <div className="App">
      <button onClick={sendStart}>Send StartNotification</button>
      <button onClick={() => props.sendRequest("Status")}>Ask Beacon for status</button>
      <Logs />
    </div>
  );
}

const mapStateToProps = (state: any) => ({
  beacon: state.beacon
});
export default withRouter(connect(mapStateToProps, { sendRequest })(Home));