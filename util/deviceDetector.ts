import { UAParser } from "ua-parser-js";

const p = new UAParser();

export const isIOS = (): boolean => {
  const os = p.getOS();
  return os.name === "iOS";
};

export const isMacOS = (): boolean => {
  const os = p.getOS();
  return os.name === "Mac OS";
};

export const isSafari = (): boolean => {
  const b = p.getBrowser();
  return b.name === "Safari";
};
