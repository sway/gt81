import { css } from "@emotion/react";
import Modal from "react-modal";

type GenericModalProps = {
  headline: string;
  isOpen: boolean;
  showClose: boolean;
  children: JSX.Element | JSX.Element[];
  onDismiss(): void;
  height?: string;
  fullscreen?: boolean;
};

const closeButtonStyle = css`
  position: absolute;
  top: 0;
  right: 0;

  width: 3.5rem;
  height: 3.5rem;
  text-align: center;
  line-height: 3.5rem;
  font-size: 2rem;
  border-radius: 0 1rem 0 1rem;

  &:hover {
    background-color: rgba(255, 255, 255, 0.25);
    cursor: pointer;
  }
`;

const headlineStyle = css`
  width: 100%;
  text-align: left;
  margin: 0;
  padding: 0;
  text-transform: uppercase;
  text-shadow: 2px 0 0 #66d8ff, -2px 0 0 #ff72be;
  padding: 1.5rem 0 0 1.5rem;
`;

export const GenericModal = (props: GenericModalProps): JSX.Element => {
  const modalStyle: ReactModal.Styles = {
    overlay: {
      backgroundColor: "rgba(0,0,0,0.9)",
    },
    content: {
      outline: "none",
      color: "white",
      fontFamily: "'Work Sans'",
    },
  };

  const partialModalStyle: ReactModal.Styles = {
    ...modalStyle,
    content: {
      ...modalStyle.content,
      position: "absolute",
      top: "50%",
      left: "50%",
      width: "55vw",
      minWidth: "450px",
      maxWidth: "700px",
      height: props.height ?? "38rem",
      padding: 0,
      transform: "translateX(-50%) translateY(-50%)",
      borderRadius: "1rem",
      border: "1px solid #333",
      backgroundImage: "url('/images/signal.svg')",
      backgroundColor: "#111",
    },
  };

  const fullscreenModalStyle: ReactModal.Styles = {
    ...modalStyle,
    content: {
      ...modalStyle.content,
      top: "0",
      left: "0",
      width: "100vw",
      height: "100vh",
      padding: "2rem",
      border: "none",
      outline: "none",
      color: "white",
      fontFamily: "'Work Sans'",
      backgroundColor: "rgba(0,0,0,0.5)",
    },
  };

  return (
    <Modal
      isOpen={props.isOpen}
      style={props.fullscreen ? fullscreenModalStyle : partialModalStyle}
    >
      {props.showClose && (
        <div css={closeButtonStyle} onClick={() => props.onDismiss()}>
          ×
        </div>
      )}
      <h1 css={headlineStyle}>{props.headline}</h1>
      <div
        css={css`
          padding: 1.5rem;
          padding-top: 0;
          display: "flex";
          flex-direction: "column";
          overflow: scroll;
        `}
      >
        {props.children}
      </div>
    </Modal>
  );
};
