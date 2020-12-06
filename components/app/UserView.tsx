import { ActionButton } from "@components/buttons/ActionButton";
import { AboutModal, ConfigModal, IOSModal } from "@components/modals";
import { HRTile, StatusTile, Tile, TimerTile } from "@components/Tile";
import { css } from "@emotion/react";
import { isIOS } from "@util/deviceDetector";
import { useInterval } from "@util/interval.hook";
import { calculateCalories, calculateWorkout } from "@util/workoutMagic";
import React, { useRef, useState } from "react";
import useLocalStorageState from "use-local-storage-state";
import { Config, Status, Tick, Workout } from "../globalTypes";

const MULTIPLIER = 1;

const gridStyles = css`
  width: 100vw;
  height: 100vh;
  display: grid;
  overflow: scroll;
  grid-template-columns: 1fr minmax(400px, 1fr) 1fr;
  grid-template-rows: 4rem 4fr 2fr 1fr;
  grid-template-areas: "status status status" "hr hr hr" "calories timer grit" ". controls .";
  gap: 1rem;
  padding: 1rem;
  font-family: "Work Sans";
  background-color: #111111;
  background-image: url("/images/topo.svg");
  color: white;

  @media screen and (max-width: 768px) {
    height: auto;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: 10vh 40vh 20vh 20vh 10vh;
    grid-template-areas: "status status" "hr hr" "timer timer" "calories grit" "controls controls";
  }
`;

const UserView = (): JSX.Element => {
  const [data, _setData] = useState<Tick>();
  const [record, _setRecord] = useState<Array<Tick>>([]);
  const [timer, setTimer] = useState(0);
  const [configModalOpen, setConfigModalOpen] = useState(false);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [config, _setConfig] = useLocalStorageState<Config>(
    "gt81-profile1-config",
    {
      default: true,
      gender: "MALE",
      age: 31,
      weight: 82,
      maxHr: 190,
    }
  );
  const [workoutDb, setWorkoutDb] = useLocalStorageState<Array<Workout>>(
    "gt81-profile1-workouts",
    []
  );
  const [status, _setStatus] = useState<Status>(
    config.default ? "UNCONFIGURED" : "OFFLINE"
  );

  const dataRef = useRef(data);
  const statusRef = useRef(status);
  const recordRef = useRef(record);
  const configRef = useRef(config);

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
    recordRef.current = [];
    _setRecord([]);
  };

  const setData = (d: Tick) => {
    dataRef.current = d;
    _setData(d);
  };

  const setStatus = (s: Status) => {
    statusRef.current = s;
    _setStatus(s);
  };

  const setConfig = (c: Config) => {
    const maxHr = 211 - 0.64 * c.age;
    configRef.current = { ...c, maxHr: maxHr };
    _setConfig({ ...c, maxHr: maxHr });
    if (!c.default && statusRef.current === "UNCONFIGURED") {
      setStatus("OFFLINE");
    }
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

  function heartRateChange(event: any) {
    if (statusRef.current !== "RUNNING" || !dataRef.current) {
      return;
    }

    const ts = Date.now();
    const fraction = dataRef.current.timestamp
      ? (ts - dataRef.current.timestamp) / 1000
      : 1;
    const factor = 60 / fraction;

    const value = event.target.value;
    const hrValue = value.getUint8(1);
    const hrPerc = hrValue / configRef.current.maxHr;

    const calorieBurn = calculateCalories(hrValue, configRef.current) / factor;

    const shouldGetGritPoint = hrPerc >= 0.81;
    const gritPoints = shouldGetGritPoint ? 1 / factor : 0;

    const totalCalories =
      (dataRef.current?.totalCalories || 0) + Math.max(calorieBurn, 0);
    const totalGritPoints =
      (dataRef.current?.totalGritPoints || 0) + gritPoints;

    setData({
      calories: calorieBurn,
      gritPoints: gritPoints,
      heartRate: hrValue,
      heartRatePercentage: hrPerc,
      totalCalories: totalCalories,
      totalGritPoints: totalGritPoints,
      timestamp: ts,
    });
  }

  function startSession() {
    setTimer(0);
    setData({
      calories: 0,
      totalCalories: 0,
      heartRate: 0,
      heartRatePercentage: 0,
      gritPoints: 0,
      totalGritPoints: 0,
      timestamp: 0,
    });
    setStatus("RUNNING");
  }

  function resumeSession() {
    setStatus("RUNNING");
  }

  function pauseSession() {
    setStatus("PAUSED");
  }

  function stopSession() {
    setStatus("ENDED");
    const workout = calculateWorkout(record);
    const wdb = workoutDb;
    wdb.push(workout);
    setWorkoutDb(wdb);
    resetRecording();
  }

  function btConnect() {
    setStatus("CONNECTING");
    return navigator.bluetooth
      .requestDevice({ filters: [{ services: ["heart_rate"] }] })
      .then((device) => {
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

  return (
    <>
      {isIOS() && <IOSModal />}
      {configModalOpen && (
        <ConfigModal
          isOpen={true}
          config={config}
          setConfig={setConfig}
          onDismiss={() => {
            setConfigModalOpen(false);
          }}
        />
      )}
      {aboutModalOpen && (
        <AboutModal
          onDismiss={() => {
            setAboutModalOpen(false);
          }}
        />
      )}
      <div css={gridStyles}>
        <StatusTile
          status={status}
          setConfigModalOpen={setConfigModalOpen}
          setAboutModalOpen={setAboutModalOpen}
        />

        <HRTile
          value={data?.heartRate}
          percentage={data?.heartRatePercentage || 0}
        />
        <Tile
          emoji="🔥"
          headline="calories burned"
          variant="calories"
          value={data?.calories}
        />

        <TimerTile timer={timer} status={status} />

        <Tile
          emoji="😬"
          headline="grit points"
          variant="grit"
          value={data?.gritPoints}
        />

        <ActionButton status={status} dispatchAction={dispatchAction} />
      </div>
    </>
  );
};

export default UserView;
