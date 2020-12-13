import { Action, Status } from "@components/globalTypes";
import { css } from "@emotion/react";
import { useEffect, useState } from "react";

const STATUS_MAPPING: { [S in Status]: { label: string; action: Action } } = {
  UNCONFIGURED: { label: "Configure", action: "CONFIGURE" },
  OFFLINE: { label: "Connect to device", action: "CONNECT" },
  CONNECTING: { label: "Connecting...", action: "VOID" },
  PAUSED: { label: "Resume", action: "RESUME" },
  RUNNING: { label: "Pause", action: "PAUSE" },
  DEMO_RUNNING: { label: "Pause", action: "PAUSE" },
  CONNECTED: { label: "▶ Start workout", action: "START" },
  ENDED: { label: "▶ Start new workout", action: "START" },
};

export const ActionButton = (props: {
  status: Status;
  dispatchAction(action: Action): void;
}): JSX.Element => {
  const [buttonText, setButtonText] = useState("");
  const shouldShowStop = ["RUNNING", "DEMO_RUNNING", "PAUSED"].includes(
    props.status
  );

  useEffect(() => {
    setButtonText(STATUS_MAPPING[props.status].label);
  }, [props.status]);

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
        style={{ width: shouldShowStop ? "30%" : "100%" }}
        disabled={props.status === "CONNECTING"}
        onClick={() =>
          props.dispatchAction(STATUS_MAPPING[props.status].action)
        }
      >
        {buttonText}
      </button>
    </div>
  );
};
