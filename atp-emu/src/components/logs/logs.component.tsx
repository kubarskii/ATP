import { LogsProps } from "./logs.types";
import { connect } from "react-redux";
import { AtpMessage, Log } from "../../types";
import "./logs.styles.css";

function Logs(props: LogsProps) {
  const { logs } = props;
  return (<div style={{
    overflow: "auto",
    height: "400px"
  }}>
    <div style={{ display: "flex" }}>
      <div style={{ width: "10%" }}>Type</div>
      <div style={{ flex: 1 }}>Message</div>
    </div>
    <div className="logs">
      {logs
        .map((log: Log) => {
          return (
            <div className={`row ${log.type.toString()
              .toLowerCase()}`} key={log.message[0] + log.message[1].toString()} style={{
              display: "flex",
              borderBottom: "1px sold #ccc"
            }}>
              <div style={{ width: "10%" }}> {log.type} </div>
              <div style={{ flex: 1 }}>{JSON.stringify(log.message, null, " ")}</div>
            </div>
          );
        })}
    </div>
  </div>);

}

const mapStateToProps = (state: any) => ({
  logs: state.logs.items
});

export default connect(mapStateToProps)(Logs);
