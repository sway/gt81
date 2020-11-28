import { Actions, Status } from "./UserView";
import tileStyles from "@styles/Tiles.module.scss";
import actionButtonStyles from "@styles/ActionButton.module.scss";

const LABEL = {
  UNCONFIGURED: "Configure",
  OFFLINE: "Connect to device",
  CONNECTING: "Connecting...",
  PAUSED: "Resume",
  RUNNING: "Pause",
  CONNECTED: "▶ Start workout",
  ENDED: "▶ Start new workout",
};

const ACTION_MAPPING = {
  UNCONFIGURED: "CONFIGURE",
  OFFLINE: "CONNECT",
  CONNECTING: "VOID",
  CONNECTED: "START",
  PAUSED: "RESUME",
  RUNNING: "PAUSE",
  ENDED: "START",
};

export const ActionButton = (props: {
  status: Status;
  dispatchAction(action: Actions): void;
}): JSX.Element => {
  const shouldShowStop = ["RUNNING", "PAUSED"].includes(props.status);
  return (
    <div className={tileStyles["tile--controls"]}>
      {shouldShowStop && (
        <button
          className={actionButtonStyles.stop}
          style={{ width: "65%" }}
          onClick={() => props.dispatchAction("END")}
        >
          🛑 Stop workout
        </button>
      )}
      <button
        className={actionButtonStyles.button}
        style={{ width: shouldShowStop ? "35%" : "100%" }}
        disabled={props.status === "CONNECTING"}
        onClick={() =>
          props.dispatchAction(ACTION_MAPPING[props.status] as Actions)
        }
      >
        {LABEL[props.status]}
      </button>
    </div>
  );
};
