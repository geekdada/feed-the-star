'use strict';

const GitHubApi = require('github');
const pkg = require('../../package.json');

module.exports = app => {
  class GitHubService extends app.Service {
    constructor(ctx) {
      super(ctx);

      Object.assign(this, new GitHubApi({
        Promise: require('bluebird'),
        timeout: 10000,
        headers: {
          accept: 'application/vnd.github.v3.star+json',
          'user-agent': `geekdada/feed-the-star v${pkg.version}`,
        },
      }));
    }
  }

  return GitHubService;
};
