import { colorTokens } from "./tokens";

export const getThemeTokens = (mode = "light") => {
  return colorTokens[mode] || colorTokens.light;
};
