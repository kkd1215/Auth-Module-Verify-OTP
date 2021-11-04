const _ = require('lodash');

const config = require('./config');
const path = require('path');

const rootPath = path.normalize(`${__dirname}/..`);

const env = process.env.NODE_ENV || 'development';

const commonConfig = {
  env,
  root: rootPath
}

const exportConfig = _.merge(commonConfig, config);

module.exports = exportConfig;