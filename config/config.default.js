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

  return exports;
};
