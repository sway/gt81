export type Tick = {
  calories: number | null;
  totalCalories: number;
  heartRate: number | null;
  heartRatePercentage: number | null;
  gritPoints: number | null;
  totalGritPoints: number;
  timestamp: number;
};

export type Config = {
  default: boolean;
  age: number;
  weight: number;
  gender: Gender;
  maxHr: number;
};

export type Workout = {
  c: number;
  g: number;
  d: number;
  s: number;
  aH: number;
  aP: number;
};

export type Status =
  | "UNCONFIGURED"
  | "OFFLINE"
  | "CONNECTING"
  | "CONNECTED"
  | "RUNNING"
  | "PAUSED"
  | "ENDED"
  | "DEMO_RUNNING";

export type Action =
  | "CONFIGURE"
  | "CONNECT"
  | "DISCONNECT"
  | "START"
  | "PAUSE"
  | "RESUME"
  | "END"
  | "VOID";

export type Gender = "MALE" | "FEMALE";
