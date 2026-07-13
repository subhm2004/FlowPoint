export const getEnv = (key: string, defaultValue: string = ""): string => {
  const value = process.env[key];
  if (value === undefined) {
    if (defaultValue !== "") {
      return defaultValue.trim();
    }
    throw new Error(`Enviroment variable ${key} is not set`);
  }
  return value.trim();
};

/** Like getEnv, but an unset variable yields the default instead of throwing. */
export const getOptionalEnv = (key: string, defaultValue = ""): string => {
  const value = process.env[key];
  return value === undefined ? defaultValue.trim() : value.trim();
};
