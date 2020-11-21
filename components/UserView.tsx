import { useInterval } from "@util/interval.hook";
import { useState, useRef } from "react";

import styles from "@styles/UserView.module.scss";

import Tile, { HRTile, TimerTile } from "./Tile";

import ActionButton from "@components/ActionButton";

type Tick = {
  calories: number;
  currentHeartRate: number;
  currentHeartRatePercentage: number;
  gritPoints: number;
  timestamp: number;
};

export type Status =
  | "OFFLINE"
  | "CONNECTING"
  | "CONNECTED"
  | "RUNNING"
  | "PAUSED";

export type Actions =
  | "CONNECT"
  | "DISCONNECT"
  | "START"
  | "PAUSE"
  | "RESUME"
  | "END";

const MULTIPLIER = 2.5;

const HEADLINE = {
  OFFLINE: "Not connected",
  CONNECTING: "Connecting...",
  CONNECTED: "Ready!",
  RUNNING: "Workout running",
  PAUSED: "Workout paused",
};

const UserView = (): JSX.Element => {
  const [data, _setData] = useState<Tick>();
  const [timer, setTimer] = useState(0);
  const [status, _setStatus] = useState<Status>("OFFLINE");
  const [btDevice, setBtDevice] = useState<BluetoothDevice>();

  useInterval(() => setTimer(timer + 1), status === "RUNNING" ? 1000 : null);

  const dataRef = useRef(data);
  const statusRef = useRef(status);

  const setData = (data: Tick) => {
    dataRef.current = data;
    _setData(data);
  };

  const setStatus = (status: Status) => {
    statusRef.current = status;
    _setStatus(status);
  };

  const dispatchAction = (action: string) => {
    switch (action) {
      case "CONNECT":
        btConnect();
        break;
      case "START":
      case "RESUME":
        startSession();
        break;
      case "PAUSE":
        pauseSession();
        break;
      case "END":
        stopSession();
        break;
    }
  };

  function heartRateChange(event: any) {
    if (statusRef.current !== "RUNNING" || !dataRef.current) {
      return;
    }

    const value = event.target.value;

    const ts = Date.now();

    const factor = dataRef.current?.timestamp
      ? 60 / ((ts - dataRef.current.timestamp) / 1000)
      : 0;

    const hr = value.getUint8(1) * MULTIPLIER;
    const hrPerc = hr / 180;
    const cb =
      factor &&
      (-55.0969 + 0.6309 * hr + 0.1988 * 82 + 0.2017 * 32) / 4.184 / factor;
    const shouldGetGritPoint = true; //hrPerc >= 81;
    const gp = shouldGetGritPoint && factor ? 1 / factor : 0;

    const newCalories = (dataRef.current?.calories || 0) + Math.max(cb, 0);
    const gritPoints = (dataRef.current?.gritPoints || 0) + gp;
    console.log({
      factor: factor,
      gp: gp,
      calories: newCalories,
      currentHeartRate: hr,
      gritPoints: gritPoints,
      diff: ts - dataRef.current.timestamp,
    });
    setData({
      calories: newCalories,
      currentHeartRate: hr,
      currentHeartRatePercentage: hrPerc,
      gritPoints: gritPoints,
      timestamp: ts,
    });
  }

  function startSession() {
    setStatus("RUNNING");
    setData({
      calories: 0,
      currentHeartRate: -1,
      currentHeartRatePercentage: 0,
      gritPoints: 0,
      timestamp: 0,
      ...dataRef.current,
    });
  }

  function pauseSession() {
    setStatus("PAUSED");
  }

  function stopSession() {
    setStatus("CONNECTED");
  }

  function btConnect() {
    setStatus("CONNECTING");
    return navigator.bluetooth
      .requestDevice({ filters: [{ services: ["heart_rate"] }] })
      .then((device) => {
        setBtDevice(device);
        return (device as any).gatt.connect();
      })
      .then((server) => {
        return server.getPrimaryService("heart_rate");
      })
      .then((service) => {
        return service.getCharacteristic("heart_rate_measurement");
      })
      .then((character) => {
        return character.startNotifications().then(() => {
          character.addEventListener(
            "characteristicvaluechanged",
            heartRateChange
          );
          setStatus("CONNECTED");
        });
      })
      .catch((e) => {
        setStatus("OFFLINE");
        console.error(e);
      });
  }

  function btDisconnect() {
    if (btDevice?.gatt?.connected) {
      btDevice.gatt.disconnect();
      setData({
        calories: 0,
        currentHeartRate: -1,
        currentHeartRatePercentage: 0,
        timestamp: 0,
        gritPoints: 0,
      });
      setStatus("OFFLINE");
    }
  }

  return (
    <div className={`${styles.grid}`}>
      <Tile variant="tile--status">{HEADLINE[status]}</Tile>

      <HRTile
        value={data?.currentHeartRate}
        percentage={data?.currentHeartRatePercentage || 0}
      />
      <Tile
        emoji="🔥"
        headline="calories burned"
        variant="tile--calories"
        value={data?.calories}
      />

      <TimerTile timer={timer} status={status} />

      <Tile
        emoji="😬"
        headline="grit points"
        variant="tile--grit"
        value={data?.gritPoints}
      />

      <ActionButton status={status} dispatchAction={dispatchAction} />
    </div>
  );
};

export default UserView;
