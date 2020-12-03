import { UAParser } from "ua-parser-js";

const p = new UAParser();

export const isIOS = () => {
  const os = p.getOS();
  return os.name === "iOS";
};

export const isMacOS = () => {
  const os = p.getOS();
  return os.name === "Mac OS";
};

export const isSafari = () => {
  const b = p.getBrowser();
  return b.name === "Safari";
};
