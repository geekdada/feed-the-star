
module.exports = (app) => {
  app.get('home', '/', 'home.index');
  app.get('feed', '/:username/rss', 'feed.index');
};
