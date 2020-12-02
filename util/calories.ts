import { Config } from "@components/globalTypes";

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
