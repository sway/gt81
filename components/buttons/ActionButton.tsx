import { Action, Status } from "@components/globalTypes";
import { buttonStyle } from "@components/modals/sharedStyles";
import tileStyles from "@styles/Tiles.module.scss";

const STATUS_MAPPING: { [S in Status]: { label: string; action: Action } } = {
  UNCONFIGURED: { label: "Configure", action: "CONFIGURE" },
  OFFLINE: { label: "Connect to device", action: "CONNECT" },
  CONNECTING: { label: "Connecting...", action: "VOID" },
  PAUSED: { label: "Resume", action: "START" },
  RUNNING: { label: "Pause", action: "RESUME" },
  CONNECTED: { label: "▶ Start workout", action: "PAUSE" },
  ENDED: { label: "▶ Start new workout", action: "START" },
};

export const ActionButton = (props: {
  status: Status;
  dispatchAction(action: Action): void;
}): JSX.Element => {
  const shouldShowStop = ["RUNNING", "PAUSED"].includes(props.status);
  return (
    <div className={tileStyles["tile--controls"]}>
      {shouldShowStop && (
        <button
          css={buttonStyle}
          className="stop"
          style={{ width: "65%" }}
          onClick={() => props.dispatchAction("END")}
        >
          🛑 Stop workout
        </button>
      )}
      <button
        css={buttonStyle}
        style={{ width: shouldShowStop ? "35%" : "100%" }}
        disabled={props.status === "CONNECTING"}
        onClick={() =>
          props.dispatchAction(STATUS_MAPPING[props.status].action)
        }
      >
        {STATUS_MAPPING[props.status].label}
      </button>
    </div>
  );
};
