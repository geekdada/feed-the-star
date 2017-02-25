'use strict';

const co = require('co');
const Promise = require('bluebird');
const LRU = require('lru-cache');
const RSS = require('rss');
const path = require('path');
const fs = require('fs');
const feedCache = LRU({
  max: 50,
  maxAge: 10 * 60 * 100,
});
let feedItemTemplate;

module.exports = app => {
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
        apiResponse = yield service.github.activity.getStarredReposForUser({
          username,
          per_page: 20,
        }).catch(err => {
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
        ttl: 60,
      });

      yield Promise.each(starList, co.wrap(function* (item) {
        const html = yield ctx.renderString(feedItemTemplate, {
          description: item.description,
          language: item.language,
          stargazers_count: item.stargazers_count,
          watchers_count: item.watchers_count,
        });

        feed.item({
          title: item.full_name,
          description: html,
          url: item.html_url,
          guid: item.id,
          author: item.owner.login,
          date: item.updated_at,
        });
      }));

      ctx.type = 'application/xml';
      ctx.body = feed.xml({ indent: true });
    }
  }

  return FeedController;
};
