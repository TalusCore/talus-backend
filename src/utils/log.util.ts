const errorLog = (...args: unknown[]) => {
  if (process.env.IS_DEVELOPMENT === 'true') {
    console.error('Error:', ...args);
  }
};

const infoLog = (...args: unknown[]) => {
  if (process.env.IS_DEVELOPMENT === 'true') {
    console.log('Info:', ...args);
  }
};

export const LogUtil = {
  error: errorLog,
  info: infoLog
};
