'use strict';

module.exports = appInfo => {
  const exports = {};

  exports.keys = appInfo.name + '_default';

  exports.view = {
    defaultViewEngine: 'nunjucks',
    mapping: {
      '.tpl': 'nunjucks',
    },
  };

  exports.site = {
    host: process.env.SITE_URL || '',
    githubClientId: process.env.GITHUB_CLIENT_ID || '',
    githubClientSecret: process.env.GITHUB_CLIENT_SECRET || '',
  };

  return exports;
};
