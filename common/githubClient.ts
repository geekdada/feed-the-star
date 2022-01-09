import { Octokit } from '@octokit/rest'
import { createOAuthAppAuth } from '@octokit/auth-oauth-app'

const github = new Octokit({
  authStrategy: createOAuthAppAuth,
  auth: {
    clientId: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
  },
  userAgent: `geekdada/feed-the-star`,
  request: {
    timeout: 10000,
  },
})

export default github
