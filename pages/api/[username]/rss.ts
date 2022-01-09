import { OctokitResponse } from '@octokit/types'
import type { NextApiRequest, NextApiResponse } from 'next'
import LRU from 'lru-cache'
import RSS from 'rss'
import Promise from 'bluebird'
import { nameToEmoji } from 'gemoji'
import githubClient from '../../../common/githubClient'
import { render } from '../../../templates'
import { FeedList } from '../../../types/github'

const feedCache = new LRU<string, FeedList>({
  max: 50,
  maxAge: 10 * 60 * 100,
})

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { username } = req.query as { username: string }
  let apiResponse: OctokitResponse<FeedList> | void
  let apiError: { msg: string; code: number; err: Error } | void
  let starList: FeedList

  if (feedCache.peek(username)) {
    starList = feedCache.get(username)
  } else {
    apiResponse = await githubClient
      .request('GET /users/:username/starred', {
        username,
        per_page: 20,
        headers: {
          accept: 'application/vnd.github.v3.star+json',
        },
      })
      .catch((err) => {
        if (err.code === 404) {
          apiError = {
            code: 404,
            msg: 'Not Found',
            err,
          }
        }

        apiError = {
          code: err.code || 500,
          msg: err.message || 'Error occurred',
          err,
        }
      })

    if (apiError) {
      return res.status(Number(apiError.code)).json({
        msg: apiError.msg,
        code: apiError.code,
      })
    }

    if (!apiResponse) {
      return res.status(Number(500)).json({
        msg: 'Error occurred',
        code: 500,
      })
    }

    starList = apiResponse.data
    feedCache.set(username, starList)
  }

  const publicURL = process.env.NEXT_PUBLIC_SITE_URL
  const feed = new RSS({
    title: `${username}'s star`, // string Title of your site or feed
    feed_url: `${publicURL}/${username}/rss`,
    site_url: `https://github.com/stars/${username}`,
  })

  await Promise.each(starList, async function (item) {
    let { description } = item.repo
    const { language, stargazers_count, watchers_count } = item.repo

    if (description) {
      description = description.replace(/:([\w+-]+):/g, (match, p1) => {
        const emoji = nameToEmoji[p1]
        if (emoji) {
          return emoji
        }
        return match
      })
    } else {
      description = ''
    }

    const html = await render('feed-item', {
      description,
      language,
      stargazers_count,
      watchers_count,
      repo_slug: `${item.repo.owner.login}/${item.repo.name}`,
    })

    feed.item({
      title: item.repo.full_name,
      description: html,
      url: item.repo.html_url,
      guid: item.repo.id,
      author: item.repo.owner.login,
      date: item.starred_at,
    })
  })

  res.setHeader('Content-Type', 'application/rss+xml')
  res.send(feed.xml({ indent: true }))
}
