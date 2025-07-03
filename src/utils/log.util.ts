let isDev = false;

export const setIsDevelopment = (value: boolean) => {
  isDev = value;
};

const errorLog = (...args: unknown[]) => {
  console.error('Error:', ...args);
};

const warnLog = (...args: unknown[]) => {
  if (isDev) {
    console.warn('Warning:', ...args);
  }
};

const infoLog = (...args: unknown[]) => {
  if (isDev) {
    console.log('Info:', ...args);
  }
};

export const LogUtil = {
  setIsDevelopment,
  error: errorLog,
  warn: warnLog,
  info: infoLog
};
