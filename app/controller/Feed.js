
const co = require('co');
const Promise = require('bluebird');
const LRU = require('lru-cache');
const RSS = require('rss');
const path = require('path');
const fs = require('fs');
const toEmoji = require('gemoji/name-to-emoji');

const feedCache = new LRU({
  max: 50,
  maxAge: 10 * 60 * 100,
});
let feedItemTemplate;

module.exports = (app) => {
  feedItemTemplate = fs.readFileSync(path.resolve(app.config.view.root[0], 'component/feedItem.tpl'), {
    encoding: 'UTF-8',
  });

  class FeedController extends app.Controller {
    * index() {
      const { ctx, service } = this;
      const { username } = ctx.params;
      let apiResponse;
      let starList;

      if (feedCache.peek(username)) {
        starList = feedCache.get(username);
      } else {
        apiResponse = yield service.github.request('GET /users/:username/starred', {
          username,
          per_page: 20,
          headers: {
            accept: 'application/vnd.github.v3.star+json',
          },
        }).catch((err) => {
          if (err.code === 404) {
            return {
              code: 404,
              msg: 'Not Found',
              error: err,
            };
          }

          return {
            code: err.code || 500,
            msg: err.message || 'Error occured',
            error: err,
          };
        });

        if (apiResponse.error) {
          ctx.status = Number(apiResponse.code);
          ctx.body = apiResponse;
          return;
        }

        starList = apiResponse.data;
        feedCache.set(username, starList);
      }

      const feed = new RSS({
        title: `${username}'s star`, // string Title of your site or feed
        feed_url: `${ctx.app.config.site.host}/${username}/rss`,
        site_url: `https://github.com/stars/${username}`,
      });

      yield Promise.each(starList, co.wrap(function* (item) {
        let {
          description,
        } = item.repo;
        const { language, stargazers_count, watchers_count } = item.repo;

        if (description) {
          description = description.replace(/:([\w+-]+):/g, (match, p1) => {
            const emoji = toEmoji[p1];
            if (emoji) {
              return emoji;
            }
            return match;
          });
        } else {
          description = '';
        }

        const html = yield ctx.renderString(feedItemTemplate, {
          description,
          language,
          stargazers_count,
          watchers_count,
        });

        feed.item({
          title: item.repo.full_name,
          description: html,
          url: item.repo.html_url,
          guid: item.repo.id,
          author: item.repo.owner.login,
          date: item.starred_at,
        });
      }));

      ctx.type = 'application/xml';
      ctx.body = feed.xml({ indent: true });
    }
  }

  return FeedController;
};
