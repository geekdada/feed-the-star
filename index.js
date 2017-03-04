'use strict';

if (process.env.NODE_ENV === 'production') {
  require('newrelic');
}

require('egg').startCluster({
  baseDir: __dirname,
  port: process.env.PORT || 7001, // default to 7001
});
