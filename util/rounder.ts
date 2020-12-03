export const roundToTwo = (num: number): number => {
  return +(Math.round(num + "e+2") + "e-2");
};
