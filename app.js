'use strict';

const assert = require('assert');
module.exports = app => {
  app.locals.title = '🌟 Feed the Star';

  assert(app.config.site.host);
  assert(app.config.site.githubClientId);
  assert(app.config.site.githubClientSecret);
};
