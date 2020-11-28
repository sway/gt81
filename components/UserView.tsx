import { useInterval } from "@util/interval.hook";
import React, { useState, useRef } from "react";
import useLocalStorageState from "use-local-storage-state";
import Head from "next/head";

import styles from "@styles/UserView.module.scss";

import { Tile, ActionButton, HRTile, TimerTile } from "./";
import { ConfigModal } from "@components/modals";

type Tick = {
  calories: number | null;
  currentHeartRate: number | null;
  currentHeartRatePercentage: number | null;
  gritPoints: number | null;
  timestamp: number;
};

export type Config = {
  default: boolean;
  age: number;
  weight: number;
  gender: Gender;
};

export type Status =
  | "UNCONFIGURED"
  | "OFFLINE"
  | "CONNECTING"
  | "CONNECTED"
  | "RUNNING"
  | "PAUSED"
  | "ENDED";

export type Actions =
  | "CONNECT"
  | "DISCONNECT"
  | "START"
  | "PAUSE"
  | "RESUME"
  | "END";

export type Gender = "MALE" | "FEMALE";

const MULTIPLIER = 1;

const HEADLINE: { [S in Status]: string } = {
  UNCONFIGURED: "Welcome to GT81! Configure your profile to get started",
  OFFLINE: "Connect to your HR monitor...",
  CONNECTING: "Connecting...",
  CONNECTED: "Ready! Let's do this 💪",
  RUNNING: "Workout running",
  PAUSED: "Workout paused",
  ENDED: "Workout completed, well done!",
};

const UserView = (): JSX.Element => {
  const [data, _setData] = useState<Tick>();
  const [record, _setRecord] = useState<Array<Tick>>([]);
  const [timer, setTimer] = useState(0);
  const [btDevice, setBtDevice] = useState<BluetoothDevice>();
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [config, setConfig] = useLocalStorageState<Config>("config", {
    default: true,
    gender: "MALE",
    age: 31,
    weight: 82,
  });
  const [status, _setStatus] = useState<Status>(
    config.default ? "UNCONFIGURED" : "OFFLINE"
  );

  const dataRef = useRef(data);
  const statusRef = useRef(status);
  const recordRef = useRef(record);

  useInterval(
    () => {
      setTimer(timer + 1);
      dataRef.current && addRecord(dataRef.current);
    },
    status === "RUNNING" ? 1000 : null
  );

  const addRecord = (data: Tick) => {
    recordRef.current.push(data);
    _setRecord(recordRef.current);
  };

  const resetRecording = () => {
    _setRecord([]);
  };

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
      case "CONFIGURE":
        setConfigModalOpen(true);
        break;
      case "CONNECT":
        btConnect();
        break;
      case "START":
        startSession();
        break;
      case "RESUME":
        resumeSession();
        break;
      case "PAUSE":
        pauseSession();
        break;
      case "END":
        stopSession();
        break;
    }
  };

  const calculateCalories = (
    hr: number,
    gender: Gender,
    age: number,
    weight: number
  ): number => {
    if (gender === "MALE") {
      return (-55.0969 + 0.6309 * hr + 0.1988 * weight + 0.2017 * age) / 4.184;
    } else {
      return (-20.4022 + 0.4472 * hr - 0.1263 * weight + 0.074 * age) / 4.184;
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
      : 60;
    const maxHR = Math.floor(211 - 0.64 * config.age);

    const hr = value.getUint8(1) * MULTIPLIER;

    const hrPerc = hr / maxHR;
    const shouldGetGritPoint = hrPerc >= 0.81;

    const cb =
      calculateCalories(hr, config.gender, config.age, config.weight) / factor;
    const gp = shouldGetGritPoint ? 1 / factor : 0;

    const totalCalories = (dataRef.current?.calories || 0) + Math.max(cb, 0);
    const totalGritPoints = (dataRef.current?.gritPoints || 0) + gp;
    setData({
      calories: totalCalories,
      currentHeartRate: hr,
      currentHeartRatePercentage: hrPerc,
      gritPoints: totalGritPoints,
      timestamp: ts,
    });
  }

  function startSession() {
    setStatus("RUNNING");
    setTimer(0);
    setData({
      calories: 0,
      currentHeartRate: 0,
      currentHeartRatePercentage: 0,
      gritPoints: 0,
      timestamp: 0,
    });
  }

  function resumeSession() {
    setStatus("RUNNING");
  }

  function pauseSession() {
    setStatus("PAUSED");
  }

  function stopSession() {
    setStatus("ENDED");
    resetRecording();
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
    <>
      <Head>
        <title>{`GT81 | ${HEADLINE[status]}`}</title>
      </Head>
      <ConfigModal
        isOpen={configModalOpen}
        setConfig={setConfig}
        onDismiss={() => {
          setConfigModalOpen(false);
          if (status === "UNCONFIGURED") {
            setStatus("OFFLINE");
          }
        }}
      />
      <div className={styles.grid}>
        <Tile variant="tile--status">
          <>
            <div
              style={{
                width: "3.5rem",
                height: "3.5rem",
                margin: "0.25rem",
                textAlign: "center",
                backgroundColor: "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "0.75rem",
                border: "1px solid #222",
              }}
            >
              👋
            </div>
            {HEADLINE[status]}
            <div
              onClick={() => setConfigModalOpen(true)}
              style={{
                width: "3.5rem",
                height: "3.5rem",
                margin: "0.25rem",
                textAlign: "center",
                backgroundColor: "#111",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: "0.75rem",
                border: "1px solid #222",
              }}
            >
              ⚙️
            </div>
          </>
        </Tile>

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
    </>
  );
};

export default UserView;
