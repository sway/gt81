import { Actions, Status } from "./UserView";
import tileStyles from "@styles/Tiles.module.scss";
import actionButtonStyles from "@styles/ActionButton.module.scss";

const LABEL = {
  OFFLINE: "Connect to device",
  CONNECTING: "Connecting...",
  PAUSED: "⏯ Resume workout",
  RUNNING: "⏸ Pause workout",
  CONNECTED: "▶ Start workout",
};

const ACTION_MAPPING = {
  OFFLINE: "CONNECT",
  CONNECTING: "VOID",
  CONNECTED: "START",
  PAUSED: "RESUME",
  RUNNING: "PAUSE",
};

const ActionButton = (props: {
  status: Status;
  dispatchAction(action: Actions): void;
}): JSX.Element => {
  return (
    <div className={tileStyles["tile--controls"]}>
      <button
        className={actionButtonStyles.button}
        disabled={props.status === "CONNECTING"}
        onClick={() =>
          props.dispatchAction(ACTION_MAPPING[props.status] as Actions)
        }
      >
        {LABEL[props.status]}
      </button>
      {["RUNNING", "PAUSED"].includes(props.status) && (
        <button
          className={actionButtonStyles.stop}
          onClick={() => props.dispatchAction("END")}
        >
          🛑 Stop
        </button>
      )}
    </div>
  );
};

export default ActionButton;
