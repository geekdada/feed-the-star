'use strict';

const GitHubApi = require('github');

module.exports = app => {
  class GitHubService extends app.Service {
    constructor(ctx) {
      super(ctx);

      Object.assign(this, new GitHubApi({
        Promise: require('bluebird'),
        timeout: 10000,
      }));
    }
  }

  return GitHubService;
};
