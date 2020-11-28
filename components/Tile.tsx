import tileStyles from "@styles/Tiles.module.scss";
import { Status } from "@components/UserView";

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
