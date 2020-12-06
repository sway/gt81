import { Config, Tick, Workout } from "@components/globalTypes";
import { roundToTwo } from "@util/rounder";

export const calculateCalories = (hr: number, config: Config): number => {
  if (config.gender === "MALE") {
    return (
      (-55.0969 + 0.6309 * hr + 0.1988 * config.weight + 0.2017 * config.age) /
      4.184
    );
  } else {
    return (
      (-20.4022 + 0.4472 * hr - 0.1263 * config.weight + 0.074 * config.age) /
      4.184
    );
  }
};

export const calculateWorkout = (records: Array<Tick>): Workout => {
  const len = records.length;
  const first = records[0];
  const last = records[len - 1];
  return {
    c: roundToTwo(last.totalCalories),
    g: roundToTwo(last.totalGritPoints),
    d: len,
    s: first.timestamp,
    aH: roundToTwo(
      records.reduce((total, next) => total + (next.heartRate || 0), 0) / len
    ),
    aP: roundToTwo(
      records.reduce(
        (total, next) => total + (next.heartRatePercentage || 0),
        0
      ) / len
    ),
  };
};
