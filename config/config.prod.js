module.exports = () => {
  const config = {};

  config.logger = {
    consoleLevel: 'INFO',
    level: 'NONE',
    disableConsoleAfterReady: false,
  };

  return config;
};
