'use strict';

const { babelLoaderFinder, eslintLoaderFinder } = require('./helpers');
const path = require('path');
/**
 * Mutate incoming webpack config and add support for typescript
 * @param  {[type]} config [description]
 * @return {[type]}        [description]
 */
function modify(config) {
  config.resolve.extensions = [...config.resolve.extensions, '.ts', '.tsx'];
  config.resolve.modules.unshift(path.resolve(__dirname, '../src'));
  // Safely locate Babel-Loader in Razzle's webpack internals
  const babelLoader = config.module.rules.find(babelLoaderFinder);
  if (!babelLoader) {
    throw new Error(
      `'babel-loader' was erased from config, we need it to define 'include' option for 'ts-loader'`
    );
  }
  babelLoader.test = /\.(js|jsx|mjs|ts|tsx)$/;

  return config;
}

module.exports = modify;