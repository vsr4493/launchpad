'use strict';
const withTypeScript = require('./razzleConfig/index');

module.exports = {
  modify(config, { target, dev }, webpack) {
    const appConfig = config; // stay immutable here
    const configWithTypescript = withTypeScript(appConfig);
    return configWithTypescript;
  },
};