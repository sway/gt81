import { Action, Status } from "@components/globalTypes";
import { css } from "@emotion/react";

const STATUS_MAPPING: { [S in Status]: { label: string; action: Action } } = {
  UNCONFIGURED: { label: "Configure", action: "CONFIGURE" },
  OFFLINE: { label: "Connect to device", action: "CONNECT" },
  CONNECTING: { label: "Connecting...", action: "VOID" },
  PAUSED: { label: "Resume", action: "RESUME" },
  RUNNING: { label: "Pause", action: "PAUSE" },
  CONNECTED: { label: "▶ Start workout", action: "START" },
  ENDED: { label: "▶ Start new workout", action: "START" },
};

export const ActionButton = (props: {
  status: Status;
  dispatchAction(action: Action): void;
}): JSX.Element => {
  const shouldShowStop = ["RUNNING", "PAUSED"].includes(props.status);
  return (
    <div
      css={css`
        grid-area: controls;
        flex-direction: row;
        background-color: transparent;
      `}
    >
      {shouldShowStop && (
        <button
          className="stop"
          style={{ width: "65%" }}
          onClick={() => props.dispatchAction("END")}
        >
          🛑 Stop workout
        </button>
      )}
      <button
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
