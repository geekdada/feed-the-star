const assert = require('assert')

assert(process.env.NEXT_PUBLIC_SITE_URL, 'NEXT_PUBLIC_SITE_URL is not defined')
assert(process.env.GITHUB_CLIENT_ID, 'GITHUB_CLIENT_ID is not set')
assert(process.env.GITHUB_CLIENT_SECRET, 'GITHUB_CLIENT_SECRET is not set')

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  /* config options here */
}

module.exports = nextConfig
