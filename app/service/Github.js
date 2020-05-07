const { Octokit } = require('@octokit/rest');
const { createOAuthAppAuth } = require('@octokit/auth-oauth-app');

const pkg = require('../../package.json');

module.exports = (app) => {
  class GitHubService extends app.Service {
    constructor(ctx) {
      super(ctx);

      const github = new Octokit({
        authStrategy: createOAuthAppAuth,
        auth: {
          clientId: app.config.site.githubClientId,
          clientSecret: app.config.site.githubClientSecret,
        },
        userAgent: `geekdada/feed-the-star/${pkg.version}`,
        request: {
          timeout: 10000,
        },
      });

      Object.assign(this, github);
    }
  }

  return GitHubService;
};
