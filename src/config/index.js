

import path from 'path';
import * as _ from 'lodash';

function requiredProcessEnv(name) {
  if (!process.env[name]) {
    throw new Error(`You must set the ${name} environment variable`);
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
const all = {
  env: process.env.NODE_ENV,

    // Root path of server
  root: path.normalize(`${__dirname}/../../..`),

    // Server IP
  ip: process.env.IP || '0.0.0.0',

};

//requiredProcessEnv();
// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
    all,
    require('./shared'),
    require(`./${process.env.NODE_ENV}.js`) || {}
    );
