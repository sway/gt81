import { Status } from "@components/globalTypes";
import { css } from "@emotion/react";
import tileStyles from "@styles/Tiles.module.scss";
import Head from "next/head";

export type TileProps = {
  emoji?: string;
  headline?: string;
  variant: keyof typeof tileStyles;
  value?: number | null;
  children?: JSX.Element | string;
};

export const Tile = (props: TileProps): JSX.Element => {
  return (
    <div className={tileStyles[props.variant]}>
      {props.emoji && (
        <div className={tileStyles["tile-headline"]}>{props.emoji}</div>
      )}
      {props.headline && (
        <div className={tileStyles["tile-headline"]}>{props.headline}</div>
      )}
      {!props.children && (
        <div>
          {typeof props.value === "number" ? Math.floor(props.value) : "--"}
        </div>
      )}
      {props.children}
    </div>
  );
};

export const HRTile = (
  props: Pick<TileProps, Exclude<keyof TileProps, "variant">> & {
    percentage: number;
  }
): JSX.Element => {
  const variant = (perc: number): keyof typeof tileStyles => {
    if (perc > 0.6) {
      const value = Math.floor(Math.min(perc, 0.99) * 10) * 10;
      return `tile--hr--${value}` as keyof typeof tileStyles;
    }

    return "tile--hr";
  };

  return (
    <Tile
      emoji="❤️"
      headline="heart rate %"
      variant={variant(props.percentage)}
    >
      <>
        <div>{Math.min(Math.floor(props.percentage * 100), 100)}</div>
        <div style={{ fontSize: "2rem", color: "rgba(255,255,255,0.75))" }}>
          ♥ {Math.floor(props.value || 0)}
        </div>
      </>
    </Tile>
  );
};

export const TimerTile = (props: {
  status: Status;
  timer: number;
}): JSX.Element => {
  const formatTimer = (timer: number): string => {
    const hours = timer / 3600;
    const minutes = (timer % 3600) / 60;
    const seconds = timer % 60;

    return [hours, minutes, seconds]
      .map((i) => Math.floor(i).toString().padStart(2, "0"))
      .join(":");
  };

  return (
    <Tile headline="elapsed time" emoji="⏱" variant="tile--timer">
      <div
        style={
          props.status === "PAUSED"
            ? { animation: "blinker 1s step-start infinite" }
            : {}
        }
      >
        {formatTimer(props.timer)}
      </div>
    </Tile>
  );
};

export const StatusTile = (props: {
  status: Status;
  setConfigModalOpen(status: boolean): void;
  setAboutModalOpen(status: boolean): void;
}): JSX.Element => {
  const HEADLINE: { [S in Status]: string } = {
    UNCONFIGURED: "Welcome to GT81! Configure your profile to get started",
    OFFLINE: "Connect to your HR monitor...",
    CONNECTING: "Connecting...",
    CONNECTED: "Ready! Let's do this 💪",
    RUNNING: "Workout running",
    PAUSED: "Workout paused",
    ENDED: "Workout completed, well done!",
  };

  const buttonCss = css`
    width: 3.5rem;
    height: 3.5rem;
    margin: 0.25rem;
    text-align: center;
    background-color: #111;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.75rem;
    border: 1px solid #222;

    &:hover {
      background-color: #222;
      cursor: pointer;
    }
  `;

  const headlineCss = css`
    text-align: center;

    @media screen and (max-width: 768px) {
      font-size: 1rem;
    }
  `;

  return (
    <Tile variant="tile--status">
      <>
        <Head>
          <title>{`GT81 | ${HEADLINE[props.status]}`}</title>
        </Head>
        <div onClick={() => props.setAboutModalOpen(true)} css={buttonCss}>
          👋
        </div>
        <div css={headlineCss}>{HEADLINE[props.status]}</div>
        <div onClick={() => props.setConfigModalOpen(true)} css={buttonCss}>
          ⚙️
        </div>
      </>
    </Tile>
  );
};
