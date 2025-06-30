let isDev = false;

export const setIsDevelopment = (value: boolean) => {
  isDev = value;
};

const errorLog = (...args: unknown[]) => {
  if (isDev) {
    console.error('Error:', ...args);
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
  info: infoLog
};
